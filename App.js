/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import CallScreen from './src/screens/Call';
import JitsiTestScreens from './src/screens/JitsiTest';
// import MainScreen from './src/screens/main';

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="JitsiTest"
          screenOptions={{
            gestureEnabled: false,
            headerShown: false,
          }}>
          <Stack.Screen
            name="JitsiTest"
            component={JitsiTestScreens}
            options={() => ({ headerShown: false })}
          />
          <Stack.Screen
            name="Call"
            component={CallScreen}
            options={() => ({ headerShown: false })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
