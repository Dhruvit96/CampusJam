import React, {useEffect, useState} from 'react';
import {FlatList, StatusBar, View} from 'react-native';
import {Header} from 'react-native-elements';
import PostItem from '../../components/PostItem';
import EmptyList from '../../components/EmptyList';
import {fontscale} from '../../constants';
import {useSelector} from '../../store';
import {navigation} from '../../navigations/RootNavigation';
import {UpdateLikedPost} from '../../actions/userActions';
import {useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/core';
const LikedPosts = ({route}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [first, setFirst] = useState(true);
  const isUserX = typeof route.params?.uid == 'string';
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const postsData = isUserX
    ? useSelector((state) => state.profile[route.params?.uid].likedPosts)
    : useSelector((state) => state.user.extraInfo.likedPosts);
  const {
    _onPressBack,
    _onRefresh,
    _renderEmpty,
    _renderItem,
  } = getEventHandlers(dispatch, first, isUserX, setFirst, setRefreshing);
  useEffect(() => {
    _onRefresh();
  }, [isFocused]);
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
        data={first ? [] : postsData}
        keyExtractor={(item) => item.postId}
        refreshing={refreshing}
        renderItem={_renderItem}
        ListEmptyComponent={first ? null : _renderEmpty}
        onRefresh={_onRefresh}
      />
    </View>
  );
};

function getEventHandlers(dispatch, first, isUserX, setFirst, setRefreshing) {
  const _onPressBack = () => {
    navigation.goBack();
  };
  const _onRefresh = async () => {
    setRefreshing(true);
    if (first)
      setTimeout(() => {
        setRefreshing(false);
        setFirst(false);
      }, 100);
    else if (!isUserX) {
      await dispatch(UpdateLikedPost());
      setRefreshing(false);
    } else setRefreshing(false);
  };
  const _renderEmpty = () => <EmptyList message="No posts to show." />;
  const _renderItem = ({item, index}) => <PostItem index={index} item={item} />;
  return {
    _onPressBack,
    _onRefresh,
    _renderEmpty,
    _renderItem,
  };
}

export default LikedPosts;
