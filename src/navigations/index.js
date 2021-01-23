import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from '../store';
import AuthStack from './AuthStack';
import {navigationRef} from './RootNavigation';
import Splash from '../screens/Splash';

const index = () => {
  const user = useSelector((state) => state.user);
  const navigationOptions = {
    headerShown: false,
    gestureEnabled: false,
  };
  const [isLoading, setIsLoading] = React.useState(true);
  setTimeout(() => {
    setIsLoading(false);
  }, 2000);
  return (
    <NavigationContainer ref={navigationRef}>
      {isLoading ? <Splash /> : !user.logined ? <AuthStack /> : <Splash />}
    </NavigationContainer>
  );
};

export default index;
