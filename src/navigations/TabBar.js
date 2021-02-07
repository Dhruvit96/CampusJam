import React, {useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Notification from '../screens/Notifications/Notification';
import {LikedPosts, Post, Posts, SharedPosts} from '../screens/Posts';
import {
  EditProfile,
  FollowersList,
  FollowingList,
  FollowingX,
  Profile,
  ProfileX,
} from '../screens/Profile';
import StudentData from '../screens/StudentData/StudentData';
import {ButtonGroup, Header} from 'react-native-elements';
import {StatusBar, View} from 'react-native';
import {fontscale} from '../constants';
import Settings from '../screens/Settings/Settings';
import Search from '../screens/Search';
import AddComment from '../screens/AddComment';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const FollowListTab = createMaterialTopTabNavigator();
const PostStack = createStackNavigator();
const NotificationStack = createStackNavigator();

const tabBarListeners = ({navigation, route}) => ({
  tabPress: () => {
    let first = false;
    if (route.focused) {
      navigation.navigate(route.name);
    }
    if (route.index === 0) {
      !first && route.routes[0].params.scrollToTop();
      first = true;
    } else {
      first = false;
    }
  },
});

const HomeTab = () => {
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
        tabBarVisible: getFocusedRouteNameFromRoute(route) !== 'AddComment',
      })}
      tabBarOptions={{
        activeTintColor: '#61c0ff',
        inactiveTintColor: 'grey',
        showLabel: false,
        keyboardHidesTabBar: true,
      }}>
      <Tab.Screen
        name="Home"
        component={PostModule}
        listeners={tabBarListeners}
      />
      <Tab.Screen
        name="StudentData"
        component={StudentData}
        listeners={tabBarListeners}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationModule}
        listeners={tabBarListeners}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileModule}
        listeners={tabBarListeners}
      />
    </Tab.Navigator>
  );
};

const screenOptions = {headerShown: false, gestureEnabled: false};

export const HomeModule = () => {
  return (
    <HomeStack.Navigator screenOptions={screenOptions}>
      <HomeStack.Screen name="Home" component={HomeTab} />
      <HomeStack.Screen name="EditProfile" component={EditProfile} />
      <HomeStack.Screen name="Settings" component={Settings} />
    </HomeStack.Navigator>
  );
};

const PostModule = () => {
  return (
    <PostStack.Navigator screenOptions={screenOptions}>
      <PostStack.Screen name="Posts" component={Posts} />
      <PostStack.Screen name="AddComment" component={AddComment} />
      <PostStack.Screen name="LikedPosts" component={LikedPosts} />
      <PostStack.Screen name="SharedPosts" component={SharedPosts} />
      <PostStack.Screen name="Search" component={Search} />
      <PostStack.Screen name="Profile" component={Profile} />
      <PostStack.Screen name="ProfileX" component={ProfileX} />
      <PostStack.Screen name="FollowList" component={FollowListModule} />
      <PostStack.Screen name="FollowingX" component={FollowingX} />
    </PostStack.Navigator>
  );
};

const NotificationModule = () => {
  return (
    <NotificationStack.Navigator screenOptions={screenOptions}>
      <NotificationStack.Screen name="Notification" component={Notification} />
      <NotificationStack.Screen name="AddComment" component={AddComment} />
      <NotificationStack.Screen name="LikedPosts" component={LikedPosts} />
      <NotificationStack.Screen name="SharedPosts" component={SharedPosts} />
      <NotificationStack.Screen name="Profile" component={Profile} />
      <NotificationStack.Screen name="ProfileX" component={ProfileX} />
      <NotificationStack.Screen name="Post" component={Post} />
      <NotificationStack.Screen name="FollowingX" component={FollowingX} />
      <NotificationStack.Screen
        name="FollowList"
        component={FollowListModule}
      />
    </NotificationStack.Navigator>
  );
};

const ProfileModule = () => {
  return (
    <ProfileStack.Navigator screenOptions={screenOptions}>
      <ProfileStack.Screen name="Profile" component={Profile} />
      <ProfileStack.Screen name="AddComment" component={AddComment} />
      <ProfileStack.Screen name="LikedPosts" component={LikedPosts} />
      <ProfileStack.Screen name="SharedPosts" component={SharedPosts} />
      <ProfileStack.Screen name="FollowList" component={FollowListModule} />
      <ProfileStack.Screen name="FollowingX" component={FollowingX} />
      <ProfileStack.Screen name="ProfileX" component={ProfileX} />
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
    <View style={{backgroundColor: 'white'}}>
      <StatusBar barStyle="dark-content" />
      <Header
        backgroundColor="transparent"
        placement="center"
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
