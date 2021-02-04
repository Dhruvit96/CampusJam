import React, {useEffect, useState} from 'react';
import {FlatList, StatusBar, View} from 'react-native';
import {Header} from 'react-native-elements';
import PostItem from '../../components/PostItem';
import LottieView from 'lottie-react-native';
import firestore from '@react-native-firebase/firestore';
import {
  fontscale,
  LIMIT_POSTS_PER_LOADING,
  widthPercentageToDP,
} from '../../constants';
import {useSelector} from '../../store';
import {navigation} from '../../navigations/RootNavigation';
const LikedPosts = () => {
  const user = useSelector((state) => state.user.userInfo);
  const [refreshing, setRefreshing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [postsData, setPostsData] = useState([]);
  const {
    _onPressBack,
    _onRefresh,
    _loadMore,
    _renderItem,
    _renderFooter,
  } = getEventHandlers(
    loaded,
    postsData,
    refreshing,
    setPostsData,
    setLoaded,
    setRefreshing,
    user,
  );
  useEffect(() => {
    _onRefresh();
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
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
          text: 'Liked Posts',
          style: {color: '#000', fontSize: fontscale(24)},
        }}
      />
      <FlatList
        data={postsData}
        extraData={refreshing}
        keyExtractor={(item) => item.postId}
        refreshing={refreshing}
        renderItem={_renderItem}
        onEndReachedThreshold={0.5}
        onEndReached={_loadMore}
        ListFooterComponent={_renderFooter}
        onRefresh={_onRefresh}
      />
    </View>
  );
};

function getEventHandlers(
  loaded,
  postsData,
  refreshing,
  setPostsData,
  setLoaded,
  setRefreshing,
  user,
) {
  const _onPressBack = () => {
    navigation.goBack();
  };
  const _onRefresh = async () => {
    setRefreshing(true);
    let postsData = await firestore()
      .collection('posts')
      .where('likedBy', 'array-contains', user.uid)
      .orderBy('created_at', 'desc')
      .limit(LIMIT_POSTS_PER_LOADING)
      .get();
    let posts = [];
    await Promise.all(
      postsData.docs.map(async (doc) => {
        let postData = doc.data();
        let userData = await firestore()
          .collection('users')
          .doc(postData.uid)
          .get();
        userData = userData.data();
        return posts.push({
          ...postData,
          avatar: userData.avatar,
          postId: doc.id,
          initials: userData.initials,
          name: userData.name,
          isFollowed: user.followings.indexOf(postData.uid) >= 0,
          isSelf: user.uid == postData.uid,
          isLiked: postData.likedBy.indexOf(user.uid) >= 0,
        });
      }),
    );
    setPostsData(posts);
    setRefreshing(false);
  };
  const _loadMore = async ({distanceFromEnd}) => {
    if (distanceFromEnd >= 0 && !loaded) {
      let starting = postsData[postsData.length - 1].created_at;
      let posts = await firestore()
        .collection('posts')
        .where('likedBy', 'array-contains', user.uid)
        .orderBy('created_at', 'desc')
        .startAfter(starting)
        .limit(LIMIT_POSTS_PER_LOADING)
        .get();
      let payload = [];
      await Promise.all(
        posts.docs.map(async (doc) => {
          let postData = doc.data();
          let userData = await firestore()
            .collection('users')
            .doc(postData.uid)
            .get();
          userData = userData.data();
          return payload.push({
            ...postData,
            avatar: userData.avatar,
            postId: doc.id,
            initials: userData.initials,
            name: userData.name,
            isFollowed: user.followings.indexOf(postData.uid) >= 0,
            isSelf: user.uid == postData.uid,
            isLiked: postData.likedBy.indexOf(user.uid) >= 0,
          });
        }),
      );
      if (payload.length < LIMIT_POSTS_PER_LOADING) setLoaded(true);
      setPostsData([...postsData, ...payload]);
    }
  };
  const _renderItem = ({item, index}) => <PostItem index={index} item={item} />;
  const _renderFooter = () => {
    return !loaded && !refreshing ? (
      <LottieView
        source={require('../../assets/animations/loading.json')}
        style={{height: widthPercentageToDP(10), alignSelf: 'center'}}
        autoPlay
        loop
      />
    ) : null;
  };
  return {
    _onPressBack,
    _onRefresh,
    _loadMore,
    _renderItem,
    _renderFooter,
  };
}

export default LikedPosts;
