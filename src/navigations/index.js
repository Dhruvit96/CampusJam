import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector} from '../store';
import AuthStack from './AuthStack';
import {navigationRef} from './RootNavigation';
import Splash from '../screens/Splash';
import {HomeModule} from './TabBar';

const index = () => {
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      {isLoading ? <Splash /> : !user.logined ? <AuthStack /> : <HomeModule />}
    </NavigationContainer>
  );
};

export default index;
