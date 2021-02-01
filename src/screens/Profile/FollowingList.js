import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import FollowListItem from '../../components/FollowListItem';

const FollowingList = ({route}) => {
  const [uid, setUid] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isfirstTime, setIsFirstTime] = useState(true);
  const [followingsData, setFollowingsData] = useState([]);
  const {_onRefresh} = getEventHandlers(setRefreshing, setFollowingsData);
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
        data={followingsData}
        keyExtractor={(item) => item.uid}
        refreshing={refreshing}
        renderItem={({item}) => <FollowListItem item={item} />}
        onRefresh={() => _onRefresh(uid)}
      />
    </View>
  );
};

function getEventHandlers(setRefreshing, setFollowingsData) {
  const _onRefresh = async (uid) => {
    setRefreshing(true);
    let userData = await firestore().collection('users').doc(uid).get();
    userData = userData.data();
    let followingsData = [];
    await Promise.all(
      userData.followings.map(async (id) => {
        let followingData = await firestore().collection('users').doc(id).get();
        followingData = followingData.data();
        return followingsData.push({
          avatar: followingData.avatar,
          id: followingData.id,
          initials: followingData.initials,
          name: followingData.name,
          uid: id,
        });
      }),
    );
    setFollowingsData(followingsData);
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

export default FollowingList;