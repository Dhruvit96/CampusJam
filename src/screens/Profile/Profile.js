import React, {useEffect, useState} from 'react';
import {RefreshControl, StatusBar, StyleSheet, View} from 'react-native';
import {Avatar, Button, Header, Text} from 'react-native-elements';
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
    _onPressAddPost,
    _onRefresh,
    _onPressFollowers,
    _onPressFollowing,
    _onPressFollowingX,
    _onPressLikedPosts,
    _onPressSharedPosts,
    _onPressSettings,
  } = getEventHandlers(
    userState.avatar,
    dispatch,
    userState.initials,
    setRefreshing,
    userState.name,
    userState.uid,
  );
  useEffect(() => {
    _onRefresh();
  }, []);
  return (
    <ScrollView
      contentContainerStyle={{flex: 1, backgroundColor: 'white'}}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={_onRefresh}
          progressViewOffset={heightPercentageToDP(10)}
        />
      }>
      <StatusBar barStyle="dark-content" />
      <Header
        backgroundColor="transparent"
        placement="center"
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
          onPress: _onPressSettings,
          size: fontscale(24),
        }}
      />
      {userState.id ? (
        <>
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
              {userState.name + '-' + userState.id}
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
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <TabComponent
                  name="Posts"
                  count={extraInfoState.posts.length}
                  onPress={_onPressSharedPosts}
                />
                <TabComponent
                  name="Followers"
                  count={extraInfoState.followers.length}
                  onPress={_onPressFollowers}
                />
                <TabComponent
                  name="Following"
                  count={userState.followings.length}
                  onPress={_onPressFollowing}
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
              onPress={_onPressEditProfile}
            />
            <PostButton
              title="Add Post"
              iconName="add"
              size={fontscale(22)}
              onPress={_onPressAddPost}
            />
            <PostButton
              title="My Posts"
              iconName="bookmark-outline"
              size={fontscale(22)}
              onPress={_onPressSharedPosts}
            />
            <PostButton
              title="Liked Posts"
              iconName="favorite-outline"
              size={fontscale(22)}
              onPress={_onPressLikedPosts}
            />
          </View>
        </>
      ) : (
        <>
          <View
            style={{
              flex: 9,
              flexDirection: 'row',
            }}>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Avatar
                rounded
                size={widthPercentageToDP(28)}
                source={userState.avatar ? {uri: userState.avatar} : null}
                title={!userState.avatar ? userState.initials : null}
                titleStyle={{fontSize: fontscale(50)}}
                containerStyle={{
                  backgroundColor: '#523',
                  margin: widthPercentageToDP(6),
                }}
              />
            </View>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: fontscale(18)}}>{userState.name}</Text>
              {userState.bio ? (
                <Text
                  h4
                  h4Style={[
                    styles.text,
                    {
                      marginTop: heightPercentageToDP(1),
                      marginBottom: heightPercentageToDP(1),
                    },
                  ]}>
                  {userState.bio}
                </Text>
              ) : null}
              <Button
                type="clear"
                onPress={_onPressEditProfile}
                title="Edit Profile"
                containerStyle={{
                  width: widthPercentageToDP(30),
                  marginTop: !userState.bio ? heightPercentageToDP(2) : 0,
                  backgroundColor: '#61c0ff',
                }}
                titleStyle={{
                  color: 'white',
                  fontSize: fontscale(15),
                }}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: heightPercentageToDP(3),
            }}>
            <View
              style={{flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
              <TabComponent
                name="Liked Posts"
                count={extraInfoState.likedPosts.length}
                onPress={_onPressLikedPosts}
              />
              <TabComponent
                name="Following"
                count={userState.followings.length}
                onPress={_onPressFollowingX}
              />
            </View>
          </View>
          <View style={{flex: 20}} />
        </>
      )}
    </ScrollView>
  );
};

function getEventHandlers(
  avatar,
  dispatch,
  initials,
  setRefreshing,
  name,
  uid,
) {
  const _onPressBack = () => {
    navigation.goBack();
  };
  const _onPressAddPost = () => {
    navigation.push('AddPost');
  };
  const _onPressEditProfile = () => {
    navigation.push('EditProfile');
  };
  const _onPressSettings = () => {
    navigation.push('Settings');
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
  const _onPressFollowingX = () => {
    navigation.push('FollowingX', {uid: uid});
  };
  const _onPressLikedPosts = () => {
    navigation.push('LikedPosts');
  };
  const _onPressSharedPosts = () => {
    navigation.push('SharedPosts');
  };
  return {
    _onPressBack,
    _onPressEditProfile,
    _onRefresh,
    _onPressAddPost,
    _onPressFollowers,
    _onPressFollowing,
    _onPressFollowingX,
    _onPressLikedPosts,
    _onPressSettings,
    _onPressSharedPosts,
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
