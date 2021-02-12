import React, {useState, useEffect} from 'react';
import {Alert, View, FlatList} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import FollowListItem from '../../components/FollowListItem';
import EmptyList from '../../components/EmptyList';
import {useSelector} from '../../store';
const FollowingList = ({route, userId}) => {
  const [uid, setUid] = useState(userId);
  const [refreshing, setRefreshing] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [followingsData, setFollowingsData] = useState([]);
  const currentUserId = useSelector((state) => state.user.userInfo.uid);
  const {_onRefresh, _renderEmpty} = getEventHandlers(
    setRefreshing,
    setFollowingsData,
    currentUserId,
  );
  useEffect(() => {
    async function fetchData() {
      if (typeof route?.params !== 'undefined') {
        setUid(route.params.uid);
        if (isFirstTime) {
          await _onRefresh(route.params.uid);
          setIsFirstTime(false);
        }
      } else if (typeof userId !== 'undefined') {
        if (isFirstTime) {
          await _onRefresh(userId);
          setIsFirstTime(false);
        }
      }
    }
    fetchData();
  }, [route]);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        data={followingsData}
        keyExtractor={(item) => item.uid}
        refreshing={refreshing}
        ListEmptyComponent={isFirstTime ? null : _renderEmpty}
        renderItem={({item}) => <FollowListItem item={item} />}
        onRefresh={() => _onRefresh(uid)}
      />
    </View>
  );
};

function getEventHandlers(setRefreshing, setFollowingsData, currentUserId) {
  const _onRefresh = async (uid) => {
    try {
      setRefreshing(true);
      let userData = await firestore().collection('users').doc(uid).get();
      userData = userData.data();
      let followingsData = [];
      let index = -1;
      await Promise.all(
        userData.followings.map(async (id, i) => {
          let followingData = await firestore()
            .collection('users')
            .doc(id)
            .get();
          followingData = followingData.data();
          if (id === currentUserId) index = i;
          return followingsData.push({
            avatar: followingData.avatar,
            id: followingData.id,
            initials: followingData.initials,
            name: followingData.name,
            uid: id,
          });
        }),
      );
      if (index > -1)
        followingsData = [
          followingsData[index],
          ...followingsData.slice(0, index),
          ...followingsData.slice(index + 1),
        ];
      setFollowingsData(followingsData);
      setRefreshing(false);
    } catch (e) {
      console.warn(e);
      Alert.alert('Error', 'Can not load following list');
    }
  };
  const _renderEmpty = () => <EmptyList message="No followings to show." />;
  return {
    _onRefresh,
    _renderEmpty,
  };
}

export default FollowingList;
