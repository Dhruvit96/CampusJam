import React, {useEffect, useState} from 'react';
import {Alert, FlatList, StatusBar, View} from 'react-native';
import {Header} from 'react-native-elements';
import PostItem from '../../components/PostItem';
import EmptyList from '../../components/EmptyList';
import firestore from '@react-native-firebase/firestore';
import {fontscale} from '../../constants';
import {useSelector} from '../../store';
import {navigation} from '../../navigations/RootNavigation';
import {AddPostsRequest} from '../../actions/postActions';
import {useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/core';
const Post = ({route}) => {
  const user = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const pid = route.params.pid;
  const [refreshing, setRefreshing] = useState(false);
  const [first, setFirst] = useState(true);
  const postData = [pid];
  const {
    _onPressBack,
    _onRefresh,
    _renderItem,
    _renderEmpty,
  } = getEventHandlers(dispatch, isFocused, setRefreshing, pid, user);
  useEffect(() => {
    async function fetchData() {
      await _onRefresh();
      setFirst(false);
    }
    fetchData();
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
          text: 'Post',
          style: {color: '#000', fontSize: fontscale(24)},
        }}
      />
      <FlatList
        data={first ? [] : postData}
        extraData={refreshing}
        ListEmptyComponent={first ? null : _renderEmpty}
        keyExtractor={(item) => item}
        refreshing={refreshing}
        renderItem={_renderItem}
        onRefresh={_onRefresh}
      />
    </View>
  );
};
function getEventHandlers(dispatch, isFocused, setRefreshing, pid, user) {
  const _onPressBack = () => {
    navigation.goBack();
  };
  const _renderItem = ({item, index}) => (
    <PostItem
      index={index}
      item={item}
      delete={true}
      isFocused={isFocused}
      onDeletePost={() => {
        navigation.goBack();
      }}
    />
  );
  const _renderEmpty = () => <EmptyList message="Post is deleted" />;
  const _onRefresh = async () => {
    try {
      setRefreshing(true);
      let postData = await firestore().collection('posts').doc(pid).get();
      if (postData.exists) {
        postData = postData.data();
        let userData = await firestore()
          .collection('users')
          .doc(postData.uid)
          .get();
        userData = userData.data();
        dispatch(
          AddPostsRequest([
            {
              ...postData,
              avatar: userData.avatar,
              postId: pid,
              initials: userData.initials,
              name: userData.name,
              isFollowed: user.followings.indexOf(postData.uid) >= 0,
              isSelf: user.uid == postData.uid,
              isLiked: postData.likedBy.indexOf(user.uid) >= 0,
            },
          ]),
        );
      }
      setRefreshing(false);
    } catch (e) {
      console.warn(e);
      Alert.alert('Error', 'Can not get post.');
    }
  };
  return {
    _onPressBack,
    _onRefresh,
    _renderItem,
    _renderEmpty,
  };
}

export default Post;
