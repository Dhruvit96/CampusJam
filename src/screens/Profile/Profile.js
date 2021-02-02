import React, {useEffect, useState} from 'react';
import {
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {Avatar, Header, Text} from 'react-native-elements';
import AppScreen from '../../components/AppScreen';
import TabComponent from '../../components/ProfileTab';
import PostButton from '../../components/PostButton';
import {useSelector} from '../../store';
import {useDispatch} from 'react-redux';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
import {navigation} from '../../navigations/RootNavigation';
import {ScrollView} from 'react-native-gesture-handler';
import {FetchExtraInfoRequest} from '../../actions/userActions';

const Profile = () => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const userState = useSelector((state) => state.user.userInfo);
  const extraInfoState = useSelector((state) => state.user.extraInfo);
  const {
    _onPressBack,
    _onPressEditProfile,
    _onRefresh,
    _onPressFollowers,
    _onPressFollowing,
  } = getEventHandlers(dispatch, setRefreshing, userState.name, userState.uid);
  useEffect(() => {
    _onRefresh();
  }, []);
  return (
    <AppScreen>
      <ScrollView
        contentContainerStyle={{flex: 1, backgroundColor: 'white'}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={_onRefresh}
            progressViewOffset={heightPercentageToDP(10)}
          />
        }>
        <Header
          backgroundColor="transparent"
          placement="center"
          containerStyle={{
            marginTop: Platform.OS == 'android' ? -StatusBar.currentHeight : 0,
          }}
          leftComponent={{
            icon: 'arrow-back',
            color: '#000',
            size: fontscale(27),
            onPress: _onPressBack,
          }}
          centerComponent={{
            text: 'My Profile',
            style: {color: '#000', fontSize: fontscale(24)},
          }}
          rightComponent={{
            icon: 'settings',
            color: '#000',
            size: fontscale(24),
          }}
        />
        <View style={styles.profileContainer}>
          <Avatar
            rounded
            size="xlarge"
            source={userState.avatar ? {uri: userState.avatar} : null}
            title={!userState.avatar ? userState.initials : null}
            titleStyle={{fontSize: fontscale(50)}}
            containerStyle={{
              backgroundColor: '#523',
              margin: widthPercentageToDP(6),
            }}
          />
          <Text h4 h4Style={{fontWeight: '300'}}>
            {useState.id ? userState.name + '-' + userState.id : userState.name}
          </Text>
          <Text h4 h4Style={styles.text}>
            {userState.bio}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: heightPercentageToDP(3),
            }}>
            <View
              style={{flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
              <TabComponent name="Posts" count={extraInfoState.posts.length} />
              <TabComponent
                name="Followers"
                count={extraInfoState.followers.length}
                onPress={() => _onPressFollowers()}
              />
              <TabComponent
                name="Following"
                count={userState.followings.length}
                onPress={() => _onPressFollowing()}
              />
            </View>
          </View>
        </View>
        <View style={styles.postContainer}>
          <PostButton
            title="Edit Profile"
            iconName="edit"
            type="feather"
            size={fontscale(20)}
            onPress={() => _onPressEditProfile()}
          />
          <PostButton title="Add Post" iconName="add" size={fontscale(22)} />
          <PostButton
            title="Shared Posts"
            iconName="bookmark-outline"
            size={fontscale(22)}
            onPress={() => console.log(userState)}
          />
          <PostButton
            title="Liked Posts"
            iconName="favorite-outline"
            size={fontscale(22)}
          />
        </View>
      </ScrollView>
    </AppScreen>
  );
};

function getEventHandlers(dispatch, setRefreshing, name, uid) {
  const _onPressBack = () => {
    navigation.goBack();
  };
  const _onPressEditProfile = () => {
    navigation.push('EditProfile');
  };
  const _onRefresh = async () => {
    setRefreshing(true);
    await dispatch(FetchExtraInfoRequest());
    setRefreshing(false);
  };
  const _onPressFollowers = () => {
    navigation.push('FollowList', {
      screen: 'Followers',
      params: {
        title: name,
        uid: uid,
      },
    });
  };
  const _onPressFollowing = () => {
    navigation.push('FollowList', {
      screen: 'Following',
      params: {
        title: name,
        uid: uid,
      },
    });
  };

  return {
    _onPressBack,
    _onPressEditProfile,
    _onRefresh,
    _onPressFollowers,
    _onPressFollowing,
  };
}

const styles = StyleSheet.create({
  child: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postContainer: {
    flex: 8,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  profileContainer: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: fontscale(19),
    color: 'grey',
    padding: 2,
    fontWeight: 'normal',
    alignSelf: 'center',
  },
});

export default Profile;
