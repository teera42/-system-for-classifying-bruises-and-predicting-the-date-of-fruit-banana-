import React, { useEffect } from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import iconwait from '../picture/applicationbanana.png'
const PreMainScreen = ({ navigation }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate('MainScreen'); // นำทางไปยังหน้าหลัก
    }, 3000);

    return () => clearTimeout(timeout); // ให้เคลียร์ timeout เมื่อ component ถูก unmount
  }, []);

  return (
    <View style={styles.container}>
        <Image source={iconwait} style={{width:100,height:100,marginBottom:20}}/>
      <Text style={{fontSize:20}}> BananaDEE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PreMainScreen;
