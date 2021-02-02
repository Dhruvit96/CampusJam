import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {Avatar, Header, Text} from 'react-native-elements';
import AppScreen from '../../components/AppScreen';
import TabComponent from '../../components/ProfileTab';
import {useSelector} from '../../store';
import {useDispatch} from 'react-redux';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
import {navigation} from '../../navigations/RootNavigation';
import {ScrollView} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import PostItem from '../../components/PostItem';

const ProfileX = ({route}) => {
  const dispatch = useDispatch();
  const uid = route.params.uid;
  const currentUser = useSelector((state) => state.user.userInfo);
  const [refreshing, setRefreshing] = useState(false);
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
  const {_headerComponent, _onRefresh, _renderItem} = getEventHandlers(
    currentUser,
    dispatch,
    setRefreshing,
    setUserState,
    userState.name,
    uid,
    userState,
  );
  useEffect(() => {
    _onRefresh();
  }, []);
  return (
    <AppScreen>
      <View style={styles.postContainer}>
        <FlatList
          data={userState.posts}
          keyExtractor={(item) => item.postId}
          //refreshing={refreshing}
          renderItem={_renderItem}
          initialNumToRender={2}
          maxToRenderPerBatch={3}
          onEndReachedThreshold={0.9}
          ListHeaderComponent={_headerComponent}
          contentContainerStyle={{backgroundColor: 'white'}}
          nestedScrollEnabled
          refreshing={refreshing}
          onRefresh={_onRefresh}
          progressViewOffset={heightPercentageToDP(10)}
        />
      </View>
    </AppScreen>
  );
};

function getEventHandlers(
  currentUser,
  dispatch,
  setRefreshing,
  setUserState,
  name,
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
    let postsData = await firestore()
      .collection('posts')
      .where('uid', '==', uid)
      .orderBy('created_at', 'desc')
      .get();
    let posts = [];
    await Promise.all(
      postsData.docs.map(async (doc) => {
        let postData = doc.data();
        return posts.push({
          ...postData,
          avatar: user.avatar,
          postId: doc.id,
          initials: user.initials,
          name: user.name,
          isFollowed: currentUser.followings.indexOf(postData.uid) >= 0,
          isSelf: currentUser.uid == postData.uid,
          isLiked: postData.likedBy.indexOf(currentUser.uid) >= 0,
        });
      }),
    );
    let followersData = await firestore()
      .collection('users')
      .where('followings', 'array-contains', currentUser.uid)
      .get();
    let followers = [];
    followersData.forEach((ref) => followers.push(ref.id));
    setUserState({
      ...user,
      isStudent: typeof user.id === 'string',
      posts: posts,
      followers: followers,
    });
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
  const _headerComponent = () => {
    return (
      <>
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
            text: userState.name,
            style: {color: '#000', fontSize: fontscale(24)},
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
              style={{
                flex: 1,
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <TabComponent name="Posts" count={userState.posts.length} />
              <TabComponent
                name="Followers"
                count={userState.followers.length}
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
      </>
    );
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

  const _renderItem = ({item, index}) => (
    <PostItem index={index} item={item} profileX={uid} />
  );

  return {
    _headerComponent,
    _onPressBack,
    _onPressFollowers,
    _onPressFollowing,
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

export default ProfileX;
