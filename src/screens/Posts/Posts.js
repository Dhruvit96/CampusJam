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
import FooterLoading from '../../components/FooterLoading';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
import {useSelector} from '../../store';
const Posts = () => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const {_onRefresh, _loadMore} = getEventHandlers(
    dispatch,
    setRefreshing,
    setLoading,
  );
  const postData = useSelector((state) => state.post);
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
              console.log(postData.posts.length);
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
        renderItem={({item, index}) => <PostItem index={index} item={item} />}
        onEndReachedThreshold={0.9}
        onEndReached={({distanceFromEnd}) => {
          if (distanceFromEnd >= 0 && !postData.loaded) {
            _loadMore();
          }
        }}
        onRefresh={() => _onRefresh()}
      />
      {loading && <FooterLoading />}
    </AppScreen>
  );
};

function getEventHandlers(dispatch, setRefreshing, setLoading) {
  const _onRefresh = async () => {
    setRefreshing(true);
    await dispatch(FetchPostListRequest());
    setRefreshing(false);
  };
  const _loadMore = async () => {
    setLoading(true);
    await dispatch(LoadMorePostListRequest());
    setLoading(false);
  };
  return {
    _onRefresh,
    _loadMore,
  };
}

export default Posts;
