import React, {useEffect, useState} from 'react';
import {FlatList, StatusBar, View} from 'react-native';
import {Header} from 'react-native-elements';
import PostItem from '../../components/PostItem';
import firestore from '@react-native-firebase/firestore';
import {fontscale} from '../../constants';
import {useSelector} from '../../store';
import {navigation} from '../../navigations/RootNavigation';
const Post = ({route}) => {
  const user = useSelector((state) => state.user.userInfo);
  const pid = route.params.pid;
  const [refreshing, setRefreshing] = useState(false);
  const [postData, setPostData] = useState([]);
  const {_onPressBack, _onRefresh, _renderItem} = getEventHandlers(
    setPostData,
    setRefreshing,
    pid,
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
          text: 'Post',
          style: {color: '#000', fontSize: fontscale(24)},
        }}
      />
      <FlatList
        data={postData}
        extraData={refreshing}
        keyExtractor={(item) => item.postId}
        refreshing={refreshing}
        renderItem={_renderItem}
        onRefresh={_onRefresh}
      />
    </View>
  );
};
function getEventHandlers(setPostData, setRefreshing, pid, user) {
  const _onPressBack = () => {
    navigation.goBack();
  };
  const _renderItem = ({item, index}) => <PostItem index={index} item={item} />;
  const _onRefresh = async () => {
    setRefreshing(true);
    let postData = await firestore().collection('posts').doc(pid).get();
    postData = postData.data();
    let userData = await firestore()
      .collection('users')
      .doc(postData.uid)
      .get();
    userData = userData.data();
    setPostData([
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
    ]);
    setRefreshing(false);
  };
  return {
    _onPressBack,
    _onRefresh,
    _renderItem,
  };
}

export default Post;
