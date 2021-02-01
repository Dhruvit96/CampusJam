import React, {useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Notification from '../screens/Notifications/Notification';
import Posts from '../screens/Posts/Posts';
import {
  EditProfile,
  FollowersList,
  FollowingList,
  Profile,
} from '../screens/Profile';
import StudentData from '../screens/StudentData/StudentData';
import {ButtonGroup, Header} from 'react-native-elements';
import {StatusBar, Platform, View} from 'react-native';
import {fontscale} from '../constants';
import AppScreen from '../components/AppScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const FollowListTab = createMaterialTopTabNavigator();

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
      <Tab.Screen name="Profile" component={ProfileModule} />
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

const ProfileModule = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{headerShown: false, gestureEnabled: false}}>
      <ProfileStack.Screen name="Profile" component={Profile} />
      <ProfileStack.Screen name="FollowList" component={FollowListModule} />
    </ProfileStack.Navigator>
  );
};

const TabBar = ({navigation, state}) => {
  const route = state.routes.filter((route) => {
    return typeof route.params !== 'undefined';
  })[0];
  const buttons = state.routes.map((route) => {
    return route.name;
  });
  const [selectedIndex, setSelectedIndex] = useState(state.index);
  const updateIndex = (index) => {
    navigation.navigate(buttons[index], route.params);
  };
  useEffect(() => {
    setSelectedIndex(state.index);
  }, [state.index]);
  return (
    <AppScreen style={{flex: 0}}>
      <View style={{backgroundColor: 'white'}}>
        <Header
          backgroundColor="transparent"
          placement="center"
          containerStyle={{
            marginTop: Platform.OS == 'android' ? -StatusBar.currentHeight : 0,
          }}
          leftComponent={{
            icon: 'arrow-back',
            color: '#000',
            size: fontscale(24),
            onPress: () => {
              navigation.goBack();
            },
          }}
          centerComponent={{
            text: route.params.title,
            style: {color: '#000', fontSize: fontscale(24)},
          }}
        />
        <ButtonGroup
          buttons={buttons}
          selectedIndex={selectedIndex}
          onPress={updateIndex}
        />
      </View>
    </AppScreen>
  );
};

const FollowListModule = () => {
  return (
    <FollowListTab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      swipeEnabled={false}
      backBehavior="none">
      <FollowListTab.Screen name="Followers" component={FollowersList} />
      <FollowListTab.Screen name="Following" component={FollowingList} />
    </FollowListTab.Navigator>
  );
};
