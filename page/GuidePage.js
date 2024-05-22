import React, { useEffect } from 'react';
import { View, Text, StyleSheet,Image,Button } from 'react-native';
import iconwait from '../picture/robin.jpg'
const GuidePage = () => {
  return (
    <><View style={styles.container2}>
      <Image style={styles.image} source={iconwait}></Image>
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
    image:{
      flex:0,
    width: '100%',
    height: '100%',
    borderRadius: 20,
    resizeMode: 'cover',},
});


export default GuidePage;