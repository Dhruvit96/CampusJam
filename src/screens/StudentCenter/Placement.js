import React, {useEffect, useState} from 'react';
import {Alert, FlatList, StatusBar, View} from 'react-native';
import {Header} from 'react-native-elements';
import PlacementItem from '../../components/PlacementItem';
import firestore from '@react-native-firebase/firestore';
import {fontscale} from '../../constants';
import {navigation} from '../../navigations/RootNavigation';
const Placement = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [placementData, setPlacementData] = useState([]);
  const {_onPressBack, _onRefresh, _renderItem} = getEventHandlers(
    setPlacementData,
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
          text: 'Placement',
          style: {color: '#71c2ff', fontSize: fontscale(24)},
        }}
      />
      <FlatList
        data={placementData}
        extraData={refreshing}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        renderItem={_renderItem}
        onRefresh={_onRefresh}
      />
    </View>
  );
};
function getEventHandlers(setPlacementData, setRefreshing) {
  const _onPressBack = () => {
    navigation.goBack();
  };
  const _renderItem = ({item}) => <PlacementItem item={item} />;
  const _onRefresh = async () => {
    try {
      setRefreshing(true);
      let documents = await firestore()
        .collection('placement')
        .orderBy('year', 'desc')
        .orderBy('package', 'asc')
        .get();
      let placementData = [];
      await Promise.all(
        documents.docs.map((doc) => {
          return placementData.push({...doc.data()});
        }),
      );
      setPlacementData(placementData);
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

export default Placement;
