import React, {useEffect, useState} from 'react';
import {FlatList, StatusBar, StyleSheet, View} from 'react-native';
import {Avatar, Button, Header, Text} from 'react-native-elements';
import TabComponent from '../../components/ProfileTab';
import {useSelector} from '../../store';
import {useDispatch} from 'react-redux';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
import {navigation} from '../../navigations/RootNavigation';
import firestore from '@react-native-firebase/firestore';
import PostItem from '../../components/PostItem';
import Loading from '../../components/Loading';
import {ToggleFollowUserRequest} from '../../actions/postActions';

const ProfileX = ({route}) => {
  const dispatch = useDispatch();
  const uid = route.params.uid;
  const currentUser = useSelector((state) => state.user.userInfo);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFollowed, setIsFollowed] = useState(true);
  const [userState, setUserState] = useState({
    avatar: null,
    bio: '',
    email: '',
    followings: [],
    followers: [],
    id: null,
    initials: '',
    isStudent: false,
    posts: [],
    name: '',
    uid: '',
  });
  const {
    _headerComponent,
    _onPressBack,
    _onPressFollowingX,
    _onPressLikedPosts,
    _onRefresh,
    _renderItem,
  } = getEventHandlers(
    currentUser,
    dispatch,
    isFollowed,
    setIsFollowed,
    setLoading,
    setRefreshing,
    setUserState,
    uid,
    userState,
  );
  useEffect(() => {
    _onRefresh();
  }, []);
  if (loading) return <Loading isVisible={loading} />;
  return (
    <View style={styles.container}>
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
          text: userState.name,
          style: {color: '#000', fontSize: fontscale(24)},
        }}
        containerStyle={{backgroundColor: 'white'}}
      />
      {userState.isStudent ? (
        <FlatList
          data={userState.posts}
          keyExtractor={(item) => item.postId}
          renderItem={_renderItem}
          ListHeaderComponent={_headerComponent}
          contentContainerStyle={{backgroundColor: 'white'}}
          nestedScrollEnabled
          refreshing={refreshing}
          onRefresh={_onRefresh}
          progressViewOffset={heightPercentageToDP(10)}
        />
      ) : (
        <>
          <View style={styles.profileContainer}>
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
                  alignSelf: 'center',
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
                count={userState.likedPosts}
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
    </View>
  );
};

function getEventHandlers(
  currentUser,
  dispatch,
  isFollowed,
  setIsFollowed,
  setLoading,
  setRefreshing,
  setUserState,
  uid,
  userState,
) {
  const _onPressBack = () => {
    navigation.goBack();
  };
  const _onRefresh = async () => {
    setRefreshing(true);
    let user = await firestore().collection('users').doc(uid).get();
    user = user.data();
    let postsData;
    let posts = [];
    let likedPosts = 0;
    let followers = [];
    if (typeof user.id === 'undefined') {
      let posts = await firestore()
        .collection('posts')
        .where('likedBy', 'array-contains', uid)
        .get();
      likedPosts = posts.size;
    } else {
      postsData = await firestore()
        .collection('posts')
        .where('uid', '==', uid)
        .orderBy('created_at', 'desc')
        .get();

      await Promise.all(
        postsData.docs.map(async (doc) => {
          let postData = doc.data();
          return posts.push({
            ...postData,
            avatar: user.avatar,
            postId: doc.id,
            initials: user.initials,
            name: user.name,
            isSelf: currentUser.uid == postData.uid,
            isLiked: postData.likedBy.indexOf(currentUser.uid) >= 0,
          });
        }),
      );
      let followersData = await firestore()
        .collection('users')
        .where('followings', 'array-contains', uid)
        .get();
      followersData.forEach((ref) => followers.push(ref.id));
    }
    setUserState({
      ...user,
      isStudent: typeof user.id === 'string',
      posts: posts,
      likedPosts: likedPosts,
      followers: followers,
    });
    setIsFollowed(currentUser.followings.indexOf(uid) > -1);
    setRefreshing(false);
    setLoading(false);
  };
  const _onPressFollowers = () => {
    navigation.push('FollowList', {
      screen: 'Followers',
      params: {
        title: userState.name,
        uid: uid,
      },
    });
  };
  const _onPressFollowing = () => {
    navigation.push('FollowList', {
      screen: 'Following',
      params: {
        title: userState.name,
        uid: uid,
      },
    });
  };
  const _onPressFollowingX = () => {
    navigation.push('FollowingX', {uid: uid});
  };
  const _onPressLikedPosts = () => {
    navigation.push('LikedPosts', {
      avatar: userState.avatar,
      initials: userState.initials,
      name: userState.name,
      uid: uid,
    });
  };
  const _headerComponent = () => {
    return (
      <>
        <View style={styles.profileContainer}>
          <Avatar
            rounded
            size={widthPercentageToDP(28)}
            source={userState.avatar ? {uri: userState.avatar} : null}
            title={!userState.avatar ? userState.initials : null}
            titleStyle={{fontSize: fontscale(50)}}
            containerStyle={{
              backgroundColor: '#523',
              margin: widthPercentageToDP(6),
              alignSelf: 'center',
            }}
          />
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: fontscale(18)}}>
              {userState.name + '-' + userState.id}
            </Text>
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
              onPress={async () => {
                await dispatch(ToggleFollowUserRequest(uid, isFollowed));
                if (!isFollowed) userState.followers.push(currentUser.uid);
                else {
                  userState.followers.splice(
                    userState.followers.indexOf(currentUser.uid),
                    userState.followers.indexOf(currentUser.uid) + 1,
                  );
                }
                setIsFollowed(!isFollowed);
              }}
              title={isFollowed ? 'Following' : 'Follow'}
              containerStyle={{
                width: widthPercentageToDP(24),
                marginTop: !userState.bio ? heightPercentageToDP(2) : 0,
                backgroundColor: isFollowed ? '#f3f3f3' : '#61c0ff',
              }}
              titleStyle={{
                color: isFollowed ? '#61c0ff' : '#f3f3f3',
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
            <TabComponent name="Posts" count={userState.posts.length} />
            <TabComponent
              name="Followers"
              count={userState.followers.length}
              onPress={_onPressFollowers}
            />
            <TabComponent
              name="Following"
              count={userState.followings.length}
              onPress={_onPressFollowing}
            />
          </View>
        </View>
      </>
    );
  };
  const _renderItem = ({item, index}) => (
    <PostItem index={index} item={item} profileX={uid} />
  );

  return {
    _headerComponent,
    _onPressBack,
    _onPressFollowers,
    _onPressFollowing,
    _onPressFollowingX,
    _onPressLikedPosts,
    _onRefresh,
    _renderItem,
  };
}

const styles = StyleSheet.create({
  child: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: heightPercentageToDP(10),
  },
  profileContainer: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: fontscale(18),
    color: 'grey',
    padding: 2,
    fontWeight: 'normal',
    alignSelf: 'center',
  },
});

export default ProfileX;
