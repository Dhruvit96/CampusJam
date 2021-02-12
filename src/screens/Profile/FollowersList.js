import React, {useState, useEffect} from 'react';
import {Alert, View, FlatList} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import FollowListItem from '../../components/FollowListItem';
import EmptyList from '../../components/EmptyList';
import {useSelector} from '../../store';

const FollowersList = ({route}) => {
  const [uid, setUid] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [followersData, setFollowersData] = useState([]);
  const userId = useSelector((state) => state.user.userInfo.uid);
  const {_onRefresh, _renderEmpty} = getEventHandlers(
    setRefreshing,
    setFollowersData,
    userId,
  );
  useEffect(() => {
    async function fetchData() {
      if (typeof route.params !== 'undefined') {
        setUid(route.params.uid);
        if (isFirstTime) {
          await _onRefresh(route.params.uid);
          setIsFirstTime(false);
        }
      }
    }
    fetchData();
  }, [route.params]);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        data={followersData}
        keyExtractor={(item) => item.uid}
        refreshing={refreshing}
        ListEmptyComponent={isFirstTime ? null : _renderEmpty}
        renderItem={({item}) => <FollowListItem item={item} />}
        onRefresh={() => _onRefresh(uid)}
      />
    </View>
  );
};

function getEventHandlers(setRefreshing, setFollowersData, userId) {
  const _onRefresh = async (uid) => {
    try {
      setRefreshing(true);
      let followers = await firestore()
        .collection('users')
        .where('followings', 'array-contains', uid)
        .get();
      let followersData = [];
      let index = -1;
      await Promise.all(
        followers.docs.map(async (doc, i) => {
          let followerData = doc.data();
          if (doc.id === userId) index = i;
          return followersData.push({
            avatar: followerData.avatar,
            id: followerData.id,
            initials: followerData.initials,
            name: followerData.name,
            uid: doc.id,
          });
        }),
      );
      if (index > -1)
        followersData = [
          followersData[index],
          ...followersData.slice(0, index),
          ...followersData.slice(index + 1),
        ];
      setFollowersData(followersData);
      setRefreshing(false);
    } catch (e) {
      console.warn(e);
      Alert.alert('Error', 'Can not load followers list');
    }
  };
  const _renderEmpty = () => <EmptyList message="No followers to show." />;
  return {
    _onRefresh,
    _renderEmpty,
  };
}

export default FollowersList;
