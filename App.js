import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PreMainScreen from './page/PreMainScreen'; // หน้า render ก่อนเข้าหน้าหลัก
import MainScreen from './page/MainScreen';
import CameraScreen from './page/Camera';
import DetailScreen from './page/Detail';
import GuideScreen from './page/GuidePage'
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PreMainScreen">
        <Stack.Screen name="PreMainScreen" component={PreMainScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BananaDetail" component={DetailScreen} />
        <Stack.Screen name="Guide" component={GuideScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

