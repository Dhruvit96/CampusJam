import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from '../reducers';
import AuthStack from './AuthStack';
import {navigationRef} from './rootNavigation';
import SplashScreen from '../screens/Splash';
import Splash from '../screens/Splash';

const Stack = createStackNavigator();
const index = () => {
  const user = useSelector((state) => state.user.user);
  const navigationOptions = {
    headerShown: false,
    gestureEnabled: false,
  };
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      return subscriber;
    }, 2000);
  }, []);
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={navigationOptions}>
        {isLoading ? (
          <Splash />
        ) : !user.logined ? (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        ) : (
          <Splash />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default index;
