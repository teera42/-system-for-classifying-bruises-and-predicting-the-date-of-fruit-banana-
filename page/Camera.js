import React, { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/AntDesign';
import Icon4 from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { usePermissions } from 'expo-media-library';
import * as MediaLibrary from 'expo-media-library';
import axios from 'axios';
import Modal from "react-native-modal";
import { CameraView, useCameraPermissions } from 'expo-camera';

const Camera = () => {
  const navigation = useNavigation();
  const [facing, setFacing] = useState('back');
  const [flashMode, setFlashMode] = useState('off');
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [resultImageBase64, setResultImageBase64] = useState(null);  // State for storing base64 image
const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [labels, setLabels] = useState([]);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  let bruiseConfidence = null;

  const [cameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, askMediaLibraryPermission] = usePermissions(MediaLibrary);

  if (!cameraPermission || !mediaLibraryPermission) {
    return <View />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Allow BananaDEE to access your camera</Text>
        <Button onPress={requestCameraPermission} title="Grant Permission" />
      </View>
    );
  }

  if (!mediaLibraryPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Allow BananaDEE to access your media library</Text>
        <Button onPress={mediaLibraryPermission} title="Grant Permission" />
      </View>
    );
  }

  const FLASH_MODE_ICON = {
    on: "flash-on",
    off: "flash-off"
  };

  const handleCancelPress = () => {
    navigation.navigate('MainScreen');
  };

  const handleDetailPress = () => {
    navigation.navigate('BananaDetail');
  };

  const handleGuidePress = () => {
    navigation.navigate('Guide');
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlashMode = () => {
    setFlashMode(current => (current === 'off' ? 'on' : 'off'));
    console.log('Flash mode toggled:', flashMode);
  };

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        // Take the picture
        const { uri } = await cameraRef.current.takePictureAsync({ skipProcessing: true });
        console.log('Picture taken:', uri);
  
        // Create form data
        const formData = new FormData();
        formData.append('file', {
          uri,
          type: 'image/jpeg',
          name: 'image.jpg',
        });
  
        // Function to handle API calls
        const postToApi = async (url, data) => {
          try {
            const response = await axios.post(url, data, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            if (response.status !== 200) {
              throw new Error(`Failed to process image. Status: ${response.status}`);
            }
            return response.data;
          } catch (error) {
            console.error(`Error posting to ${url}:`, error);
            throw new Error(`Failed to send image to API: ${error.message}`);
          }
        };
  
        // Send image to detectImage API
        await postToApi('https://7cd1-202-28-63-131.ngrok-free.app/detectImage', formData);
  
        // Send image to getLabel API and handle response
        const responseData = await postToApi('https://7cd1-202-28-63-131.ngrok-free.app/getLabel', formData);
        console.log('API response:', responseData);
  
        // Fetch the latest image and labels if needed
        fetchLatestImage();
        fetchLabels();
        
      } catch (error) {
        console.error('Error taking picture or processing API calls:', error);
      } finally {
        setIsCapturing(false);
      }
    }
  };
  
  

  const fetchLatestImage = async () => {
    try {
      const response = await axios.get('https://7cd1-202-28-63-131.ngrok-free.app/latestImage');
      if (response.data && response.data.image) {
        setResultImageBase64(response.data.image);
        toggleModal();
      } else {
        console.error('No image data received');
      }
    } catch (error) {
      console.error('Error fetching latest image:', error);
    }
  };
  const fetchLabels = () => {
    setLoading(true);
    fetch('https://7cd1-202-28-63-131.ngrok-free.app/valuelabel')
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setLabels(data.labels);
        }
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  const openImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
      });
  
      if (result.canceled) {
        console.log('Image selection cancelled');
        return;
      }
  
      const { uri } = result.assets[0];
      if (!uri) {
        throw new Error('No image selected');
      }
  
      console.log('Image selected:', uri);
  
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
  
      try {
        const detectImageResponse = await axios.post('https://7cd1-202-28-63-131.ngrok-free.app/detectImage', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (detectImageResponse.status !== 200) {
          throw new Error('Failed to process image. Status: ' + detectImageResponse.status);
        }
  
        // Process the response from /detectImage if needed
  
        const getLabelResponse = await axios.post('https://7cd1-202-28-63-131.ngrok-free.app/getLabel', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (getLabelResponse.status !== 200) {
          throw new Error('Failed to fetch labels. Status: ' + getLabelResponse.status);
        }
  
        // Process the response from /getLabel if needed
  
        console.log('Image processing complete');
      } catch (error) {
        console.error('Error during image processing:', error);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
    fetchLatestImage();
    fetchLabels();
  };
  console.log(labels);
  return (
    <>
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing={facing}
          flash={flashMode}
          ref={cameraRef}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleCancelPress}>
              <Text style={styles.text}><Icon name="delete-left" size={20} color="white" /></Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}><Icon name="camera-rotate" size={20} color="white" /></Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={toggleFlashMode}>
              <Text style={styles.text}><Icon2 name={FLASH_MODE_ICON[flashMode]} size={20} color="white" /></Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleGuidePress}>
              <Text style={styles.text}><Icon name="circle-exclamation" size={20} color="white" /></Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
      <View style={styles.buttonContainer2}>
        <TouchableOpacity style={styles.button2} onPress={handleDetailPress}>
          <Text style={styles.text}><Icon2 name="menu" size={30} color="#0067AC" /></Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button2} onPress={takePicture}>
          <Text style={styles.text}><Icon name="camera" size={30} color="#0067AC" /></Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button2} onPress={openImagePicker}>
          <Text style={styles.text}><Icon3 name="picture" size={30} color="#0067AC" /></Text>
        </TouchableOpacity>
      </View>
      <Modal isVisible={isModalVisible}>
  <View style={{ flex: 1, backgroundColor: 'white' }}>
    <Icon4 name="return-up-back" size={50} color="black" onPress={toggleModal} />
    {resultImageBase64 && (
      <Image
        source={{ uri: `data:image/jpeg;base64,${resultImageBase64}` }}
        style={{ width: '100%', height: '50%', resizeMode: 'cover' }}
      />
    )}
   <View style={{paddingTop: 20}}>
  {labels.map((item, index) => {
    if (item.name === 'Bruise') {
      bruiseConfidence = item.confidence;
      return (
        <Text key={index} style={{textAlign: 'center'}}>
          {item.name}(ค่าความช้ำ)                         {(item.confidence.toFixed(2) * 100)}%
        </Text>
      );
    }
    return null;
  })}
</View>


    <View style={{paddingTop: 20}}>
      {labels.map((item, index) => (
        item.name === 'Bruise' && (
         <Text key={index} style={{textAlign: 'center'}}>Not {item.name}(ค่าความไม่ช้ำ)              {100-(item.confidence.toFixed(2)*100)}%</Text>
        )
      ))}
      
    </View>

    <View style={{paddingTop:20,paddingBottom:20}}>
  {labels.map((item, index) => (
    item.name.includes('Banana_day') && (
      <Text key={index} style={{textAlign: 'center'}}>{item.name}(ค่าคาดเดาวัน)          {(item.confidence.toFixed(2))*100}%</Text>
    )
  ))}
</View>
    
<View style={{ height: 1, backgroundColor: 'black' }} />
<View style={{ height: 1, backgroundColor: 'black' }} />
  <View style={{ paddingLeft: 50, paddingTop: 20, paddingBottom: 20 }}>
    <Text style={{ textAlign: 'left' }}>Conclusion</Text>
  </View>
  <View>
  {labels.map((item, index) => {
    const splitName = item.name.split('y');
    const lastPart = splitName[splitName.length - 1]; // เลือกตัวสุดท้าย

    // ตรวจสอบว่าชื่อป้ายชื่อมีคำว่า "banana_day" อยู่หรือไม่
    if (item.name.toLowerCase().includes('banana_day')) {
      // ตรวจสอบค่า confidence ของ "Bruise"
      const isBruise = bruiseConfidence >= 0.5;
 console.log(bruiseConfidence)
      // สร้างข้อความตามเงื่อนไข
      const resultMessage = isBruise ? 'bruise' : 'not bruise';

      return (
        <Text key={index} style={{ textAlign: 'center' }}>
          Your banana is {lastPart} day old and quite {resultMessage}.
        </Text>
      );
    }
    return null; // ถ้าไม่ใช่ป้ายชื่อ "banana_day" ให้ส่งค่า null เพื่อไม่แสดงผล
  })}
</View>

  </View>
</Modal>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    width: '100%',
    height: '80%',
    marginTop: 20,
  },
  camera: {
    flex: 0,
    width: '100%',
    height: '100%',
  },
  buttonContainer2: {
    width: '100%',
    height: '20%',
    flex: 0,
    flexDirection: 'row',
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden'
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'black',
    margin: 0,
    justifyContent: 'space-between',
  },
  button: {
    flex: 0,
    padding: 10,
  },
  button2: {
    flex: 0,
    padding: 40,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center'
  },
});

export default Camera;
