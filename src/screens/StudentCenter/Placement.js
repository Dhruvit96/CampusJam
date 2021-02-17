import React, {useEffect, useState} from 'react';
import {Alert, FlatList, StatusBar, View} from 'react-native';
import {Header} from 'react-native-elements';
import PlacementItem from '../../components/PlacementItem';
import firestore from '@react-native-firebase/firestore';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
import LottieView from 'lottie-react-native';
import {navigation} from '../../navigations/RootNavigation';
const Placement = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [placementData, setPlacementData] = useState([]);
  const [last, setLast] = useState();
  const LIMIT = 12;
  const [loaded, setLoaded] = useState(false);
  const {
    _loadMore,
    _onPressBack,
    _onRefresh,
    _renderFooter,
    _renderItem,
  } = getEventHandlers(
    placementData,
    last,
    LIMIT,
    loaded,
    refreshing,
    setPlacementData,
    setRefreshing,
    setLast,
    setLoaded,
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
          style: {color: '#000', fontSize: fontscale(24)},
        }}
      />
      <FlatList
        data={placementData}
        extraData={refreshing}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        renderItem={_renderItem}
        onEndReachedThreshold={0.5}
        onRefresh={() => {}}
        onEndReached={loaded ? null : _loadMore}
        ListFooterComponent={_renderFooter}
      />
    </View>
  );
};
function getEventHandlers(
  data,
  last,
  LIMIT,
  loaded,
  refreshing,
  setPlacementData,
  setRefreshing,
  setLast,
  setLoaded,
) {
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
        .limit(LIMIT)
        .get();
      setLast(documents.docs[documents.size - 1]);
      let placementData = [];
      await Promise.all(
        documents.docs.map((doc) => {
          return placementData.push({...doc.data()});
        }),
      );
      if (documents.size < LIMIT) setLoaded(true);
      setPlacementData(placementData);
      setRefreshing(false);
    } catch (e) {
      console.warn(e);
      Alert.alert('Error', 'Can not get data.');
    }
  };
  const _loadMore = async () => {
    try {
      setRefreshing(true);
      let documents = await firestore()
        .collection('placement')
        .orderBy('year', 'desc')
        .orderBy('package', 'asc')
        .startAfter(last)
        .limit(LIMIT)
        .get();
      setLast(documents.docs[documents.size - 1]);
      let placementData = data;
      await Promise.all(
        documents.docs.map((doc) => {
          return placementData.push({...doc.data()});
        }),
      );
      if (documents.size < LIMIT) setLoaded(true);
      setPlacementData(placementData);
      setRefreshing(false);
    } catch (e) {
      console.warn(e);
      Alert.alert('Error', 'Can not get data.');
    }
  };
  const _renderFooter = () => {
    return (
      !loaded &&
      !refreshing && (
        <LottieView
          source={require('../../assets/animations/loading.json')}
          style={{
            height: widthPercentageToDP(8),
            marginTop: heightPercentageToDP(1),
            marginBottom: heightPercentageToDP(1),
            alignSelf: 'center',
          }}
          autoPlay
          loop
        />
      )
    );
  };
  return {_loadMore, _onPressBack, _onRefresh, _renderFooter, _renderItem};
}

export default Placement;
