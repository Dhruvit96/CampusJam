import React from 'react';
import Login from '../screens/Auth';
import SignUp from '../screens/Auth';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();
const AuthStack = () => {
  const navigationOptions = {
    headerShown: false,
    gestureEnabled: false,
  };
  return (
    <Stack.Navigator screenOptions={navigationOptions}>
      <Stack.Screen component={Login} name="Login" />
      <Stack.Screen component={SignUp} name="SignUp" />
      <Stack.Screen component={ForgotPassword} name="ForgotPassword" />
    </Stack.Navigator>
  );
};

export default AuthStack;
