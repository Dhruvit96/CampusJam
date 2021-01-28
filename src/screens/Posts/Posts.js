import React, {useEffect, useState} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {Icon, Text} from 'react-native-elements';
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
      <View
        style={{
          width: '100%',
          height: heightPercentageToDP(9),
          flexDirection: 'row',
          backgroundColor: '#61c0ff',
          borderBottomEndRadius: heightPercentageToDP(3),
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: fontscale(34),
              color: '#fff',
            }}>
            Home
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-end',
            marginTop: widthPercentageToDP(2),
            marginEnd: widthPercentageToDP(4),
          }}>
          <TouchableOpacity
            onLongPress={() => {
              dispatch(LoadMorePostListRequest());
            }}
            onPress={() => {
              console.log(postData.posts[0].isFollowed);
              console.log(postData.loaded);
              //let lastTime = postData.posts[postData.posts.length - 1].text;
              //console.log(lastTime);
            }}>
            <Icon name="search" size={fontscale(30)} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
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
