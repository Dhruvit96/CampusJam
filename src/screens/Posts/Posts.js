import React, {useEffect, useState} from 'react';
import {FlatList, StatusBar, View} from 'react-native';
import {Header} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {
  FetchPostListRequest,
  LoadMorePostListRequest,
} from '../../actions/postActions';
import PostItem from '../../components/PostItem';
import EmptyList from '../../components/EmptyList';
import LottieView from 'lottie-react-native';
import {fontscale, widthPercentageToDP} from '../../constants';
import {useSelector} from '../../store';
import {useScrollToTop} from '@react-navigation/native';
import {navigation} from '../../navigations/RootNavigation';
const Posts = () => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [first, setFirst] = useState(true);
  const postData = useSelector((state) => state.post);
  const ref = React.useRef(null);
  useScrollToTop(ref);
  const {
    _onRefresh,
    _onPressSearch,
    _loadMore,
    _renderEmpty,
    _renderItem,
    _renderFooter,
  } = getEventHandlers(dispatch, setRefreshing, refreshing, postData.loaded);
  useEffect(() => {
    _onRefresh();
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
        centerComponent={{
          text: 'Posts',
          style: {color: '#000', fontSize: fontscale(24)},
        }}
        rightComponent={{
          icon: 'search',
          color: '#000',
          onPress: _onPressSearch,
          size: fontscale(30),
        }}
      />
      <FlatList
        ref={ref}
        data={postData.posts}
        extraData={refreshing}
        keyExtractor={(item) => item.postId}
        refreshing={refreshing}
        renderItem={_renderItem}
        ListEmptyComponent={first ? null : _renderEmpty}
        onEndReachedThreshold={0.5}
        onEndReached={_loadMore}
        ListFooterComponent={_renderFooter}
        onRefresh={_onRefresh}
      />
    </View>
  );
};

function getEventHandlers(dispatch, setRefreshing, refreshing, loaded) {
  const _onRefresh = async () => {
    setRefreshing(true);
    await dispatch(FetchPostListRequest());
    setRefreshing(false);
  };
  const _onPressSearch = () => {
    navigation.push('Search');
  };
  const _loadMore = async ({distanceFromEnd}) => {
    if (distanceFromEnd >= 0 && !loaded) {
      await dispatch(LoadMorePostListRequest());
    }
  };
  const _renderEmpty = () => <EmptyList message="No posts to show." />;
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
    _onRefresh,
    _onPressSearch,
    _loadMore,
    _renderEmpty,
    _renderItem,
    _renderFooter,
  };
}

export default Posts;
