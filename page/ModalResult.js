import React, { useEffect } from 'react';
import { View, Text, StyleSheet,Image,Button,ScrollView } from 'react-native';
import bruise from '../picture/bruise.png'
import nonbruise from '../picture/nonbruise.png'
import date1 from '../picture/date1.jpg'
import date2 from '../picture/date2.jpg'
import date3 from '../picture/date3.jpg'
import date4  from '../picture/date4.jpg'
import date5 from '../picture/date5.jpg'

const ModalReult = () => {
  return (
    <><ScrollView style={{width:'100%',height:'100%',backgroundColor:'white'}}>
    <View style={styles.container}>
     <Text>Classified by bruise</Text>
      </View>
      <View style={styles.container2}>
        <View style={styles.container3}>
        <Image source={nonbruise} style={styles.image}/>
        <Text style={{textAlign:'center'}}>
          Non-Bruise
        </Text></View>
        <View style={styles.container3}>
         <Image source={bruise} style={styles.image}/>
         <Text style={{textAlign:'center'}}>Bruise
          </Text></View>
      </View>
      <View style={styles.container}>
      <Text>Classified by day</Text>
    </View>
    <View style={styles.container2}>
      <View style={styles.container3}>
      <Image source={date1}style={styles.image2}/>
      <Text style={{textAlign:'center'}}>BananaDay1</Text>
      </View>
      <View style={styles.container3}>
      <Image source={date2}style={styles.image2}/>
      <Text style={{textAlign:'center'}}>BananaDay2</Text></View>
      <View style={styles.container3} >
      <Image source={date3}style={styles.image2}/>
      <Text style={{textAlign:'center'}}>BananaDay3</Text></View>
    </View>
    <View style={styles.container2}>
      <View style={styles.container3}>
      <Image source={date4}style={styles.image2}/>
      <Text style={{textAlign:'center'}}>BananaDay4</Text></View>
      <View style={styles.container3}>
      <Image source={date5}style={styles.image2}/>
      <Text style={{textAlign:'center'}}>BananaDay5</Text></View>
    </View></ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor:'#78B7FF',
    margin:'0'
  },
  container2: {
    flex: 1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    width:'100%',
    height:'100%',
    gap:20,
    margin:10
    },
    container3: {
      flex: 1,
      gap:20,
      margin:5
      },
    image:{
      flex:1,
    width: '100%',
    height: 300,
    resizeMode: 'cover',},
    image2:{
      flex:1,
      width: '100%',
    height: 200,
    resizeMode: 'cover',}
});


export default ModalReult;