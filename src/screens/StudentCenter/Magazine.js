import React, {useEffect, useState} from 'react';
import {Alert, FlatList, StatusBar, View} from 'react-native';
import {Header} from 'react-native-elements';
import MagazineItem from '../../components/MagazineItem';
import firestore from '@react-native-firebase/firestore';
import {fontscale} from '../../constants';
import {navigation} from '../../navigations/RootNavigation';
const Magazine = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [magazineData, setMagazineData] = useState([]);
  const {_onPressBack, _onRefresh, _renderItem} = getEventHandlers(
    setMagazineData,
    setRefreshing,
  );
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
          text: 'Magazine',
          style: {color: '#71c2ff', fontSize: fontscale(24)},
        }}
      />
      <FlatList
        data={magazineData}
        extraData={refreshing}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        renderItem={_renderItem}
        onRefresh={_onRefresh}
      />
    </View>
  );
};
function getEventHandlers(setMagazineData, setRefreshing) {
  const _onPressBack = () => {
    navigation.goBack();
  };
  const _renderItem = ({item}) => <MagazineItem item={item} />;
  const _onRefresh = async () => {
    try {
      setRefreshing(true);
      let documents = await firestore()
        .collection('magazine')
        .orderBy('date', 'desc')
        .get();
      let magazineData = [];
      await Promise.all(
        documents.docs.map((doc) => {
          return magazineData.push({id: doc.id, ...doc.data()});
        }),
      );
      setMagazineData(magazineData);
      setRefreshing(false);
    } catch (e) {
      console.warn(e);
      Alert.alert('Error', 'Can not get data.');
    }
  };
  return {
    _onPressBack,
    _onRefresh,
    _renderItem,
  };
}

export default Magazine;
