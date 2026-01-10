import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmailScreen from '../screens/auth/EmailScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import CreatePasswordScreen from '../screens/auth/CreatePasswordScreen';
import ConfirmPasswordScreen from '../screens/auth/ConfirmPasswordScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import UsernameScreen from '../screens/auth/UsernameScreen';
import AvatarScreen from '../screens/auth/AvatarScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName="LoginScreen"
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="EmailScreen" component={EmailScreen} />
      <Stack.Screen name="OTPScreen" component={OTPScreen} />
      <Stack.Screen name="CreatePasswordScreen" component={CreatePasswordScreen} />
      <Stack.Screen name="ConfirmPasswordScreen" component={ConfirmPasswordScreen} />
      <Stack.Screen name="UsernameScreen" component={UsernameScreen} />
      <Stack.Screen name="AvatarScreen" component={AvatarScreen} />
    </Stack.Navigator>
  );
}
