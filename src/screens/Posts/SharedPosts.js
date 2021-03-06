import React, {useEffect, useState} from 'react';
import {FlatList, StatusBar, View} from 'react-native';
import {Header} from 'react-native-elements';
import PostItem from '../../components/PostItem';
import EmptyList from '../../components/EmptyList';
import {fontscale} from '../../constants';
import {useSelector} from '../../store';
import {navigation} from '../../navigations/RootNavigation';
import {useIsFocused} from '@react-navigation/core';
const SharedPosts = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [first, setFirst] = useState(true);
  const isFocused = useIsFocused();
  const postsData = useSelector((state) => state.user.extraInfo.posts);
  const {
    _onPressBack,
    _onRefresh,
    _renderEmpty,
    _renderItem,
  } = getEventHandlers(first, setFirst, isFocused, setRefreshing);
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
          text: 'My Posts',
          style: {color: '#000', fontSize: fontscale(24)},
        }}
      />
      <FlatList
        data={first ? [] : postsData}
        keyExtractor={(item) => item}
        refreshing={refreshing}
        renderItem={_renderItem}
        ListEmptyComponent={first ? null : _renderEmpty}
        onRefresh={() => {}}
      />
    </View>
  );
};

function getEventHandlers(first, setFirst, isFocused, setRefreshing) {
  const _onPressBack = () => {
    navigation.goBack();
  };
  const _onRefresh = () => {
    setRefreshing(true);
    if (first)
      setTimeout(() => {
        setRefreshing(false);
        setFirst(false);
      }, 100);
    else setRefreshing(false);
  };
  const _renderEmpty = () => <EmptyList message="No posts to show." />;
  const _renderItem = ({item, index}) => (
    <PostItem index={index} item={item} delete={true} isFocused={isFocused} />
  );
  return {
    _onPressBack,
    _onRefresh,
    _renderEmpty,
    _renderItem,
  };
}

export default SharedPosts;
