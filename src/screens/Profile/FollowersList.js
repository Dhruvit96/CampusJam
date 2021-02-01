import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import FollowListItem from '../../components/FollowListItem';

const FollowersList = ({route}) => {
  const [uid, setUid] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isfirstTime, setIsFirstTime] = useState(true);
  const [followersData, setFollowersData] = useState([]);
  const {_onRefresh} = getEventHandlers(setRefreshing, setFollowersData);
  useEffect(() => {
    if (typeof route.params !== 'undefined') {
      setUid(route.params.uid);
      if (isfirstTime) {
        _onRefresh(route.params.uid);
        setIsFirstTime(false);
      }
    }
  }, [route.params]);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        data={followersData}
        keyExtractor={(item) => item.uid}
        refreshing={refreshing}
        renderItem={({item}) => <FollowListItem item={item} />}
        onRefresh={() => _onRefresh(uid)}
      />
    </View>
  );
};

function getEventHandlers(setRefreshing, setFollowersData) {
  const _onRefresh = async (uid) => {
    setRefreshing(true);
    let followers = await firestore()
      .collection('users')
      .where('followings', 'array-contains', uid)
      .get();
    let followersData = [];
    await Promise.all(
      followers.docs.map(async (doc) => {
        let followerData = doc.data();
        return followersData.push({
          avatar: followerData.avatar,
          id: followerData.id,
          initials: followerData.initials,
          name: followerData.name,
          uid: doc.id,
        });
      }),
    );
    setFollowersData(followersData);
    setRefreshing(false);
  };
  return {
    _onRefresh,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FollowersList;
