import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Notification from '../screens/Notifications/Notification';
import Posts from '../screens/Posts/Posts';
import {EditProfile, Profile} from '../screens/Profile';
import StudentData from '../screens/StudentData/StudentData';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

export const HomeTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName = '';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'StudentData') iconName = 'graduation-cap';
          else if (route.name === 'Notification') iconName = 'bell';
          else if (route.name === 'Profile') iconName = 'user';
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#61c0ff',
        inactiveTintColor: 'grey',
        showLabel: false,
      }}>
      <Tab.Screen name="Home" component={Posts} />
      <Tab.Screen name="StudentData" component={StudentData} />
      <Tab.Screen name="Notification" component={Notification} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export const HomeModule = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{headerShown: false, gestureEnabled: false}}>
      <HomeStack.Screen name="Home" component={HomeTab} />
      <HomeStack.Screen name="EditProfile" component={EditProfile} />
    </HomeStack.Navigator>
  );
};
