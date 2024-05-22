import React, { useEffect } from 'react';
import { View, Text, StyleSheet,Image,Button } from 'react-native';
import iconwait from '../picture/robin.jpg'
import { useNavigation } from '@react-navigation/native';
const MainScreen = () => {
  const navigation = useNavigation();
  const handleStartPress = () => {
    // Navigate to the Camera screen
    navigation.navigate('CameraScreen');
  };
  return (
    <><View style={styles.container2}>
      <Image style={styles.image} source={iconwait}></Image>
      </View>
      <View style={styles.container}>
      <Text style={{marginTop:20, marginBottom:20}}>Let's get started.</Text>
      <Button style={styles.button}
        title="Start"
        onPress={handleStartPress}
      />
    </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    height:'30%',
    alignItems: 'center',
  },
  container2: {
    marginTop: 20,
    flex: 0,
    width: '100%',
    height: '70%'},
    image:{
      flex:0,
    width: '100%',
    height: '100%',
    borderRadius: 20,
    resizeMode: 'cover',},
    button:{
      backgroundColor:'black',
      paddingTop:20
    }
});


export default MainScreen;