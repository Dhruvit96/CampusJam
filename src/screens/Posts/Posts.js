import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon, Text, Header} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {
  FetchPostListRequest,
  LoadMorePostListRequest,
} from '../../actions/postActions';
import AppScreen from '../../components/AppScreen';
import PostItem from '../../components/PostItem';
import LottieView from 'lottie-react-native';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
import {useSelector} from '../../store';
const Posts = () => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const postData = useSelector((state) => state.post);
  const {_onRefresh, _loadMore, _renderItem, _renderFooter} = getEventHandlers(
    dispatch,
    setRefreshing,
    refreshing,
    postData.loaded,
  );
  useEffect(() => {
    _onRefresh();
  }, []);
  return (
    <AppScreen>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Header
          backgroundColor="transparent"
          placement="center"
          containerStyle={{
            marginTop: Platform.OS == 'android' ? -StatusBar.currentHeight : 0,
          }}
          centerComponent={{
            text: 'Posts',
            style: {color: '#000', fontSize: fontscale(24)},
          }}
          rightComponent={{
            icon: 'search',
            color: '#000',
            size: fontscale(30),
          }}
        />
        <FlatList
          data={postData.posts}
          keyExtractor={(item) => item.postId}
          refreshing={refreshing}
          renderItem={_renderItem}
          initialNumToRender={2}
          maxToRenderPerBatch={3}
          onEndReachedThreshold={0.9}
          onEndReached={_loadMore}
          ListFooterComponent={_renderFooter}
          onRefresh={_onRefresh}
        />
      </View>
    </AppScreen>
  );
};

function getEventHandlers(dispatch, setRefreshing, refreshing, loaded) {
  const _onRefresh = async () => {
    setRefreshing(true);
    await dispatch(FetchPostListRequest());
    setRefreshing(false);
  };
  const _loadMore = async ({distanceFromEnd}) => {
    if (distanceFromEnd >= 0 && !loaded) {
      await dispatch(LoadMorePostListRequest());
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
    _onRefresh,
    _loadMore,
    _renderItem,
    _renderFooter,
  };
}

export default Posts;
