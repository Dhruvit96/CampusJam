import React, {useEffect, useState} from 'react';
import {FlatList, StatusBar, View} from 'react-native';
import {Header} from 'react-native-elements';
import PlacementItem from '../../components/PlacementItem';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
import LottieView from 'lottie-react-native';
import {navigation} from '../../navigations/RootNavigation';
import {
  FetchPlacementListRequest,
  LoadMorePlacementRequest,
} from '../../actions/studentDataActions';
import {useSelector} from '../../store';
import {useDispatch} from 'react-redux';
const Placement = () => {
  const [refreshing, setRefreshing] = useState(false);
  const placementData = useSelector((state) => state.studentData.placementData);
  const loaded = useSelector((state) => state.studentData.loadedPlacement);
  const dispatch = useDispatch();
  const {
    _loadMore,
    _onPressBack,
    _onRefresh,
    _renderFooter,
    _renderItem,
  } = getEventHandlers(dispatch, loaded, refreshing, setRefreshing);
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
function getEventHandlers(dispatch, loaded, refreshing, setRefreshing) {
  const _onPressBack = () => {
    navigation.goBack();
  };
  const _renderItem = ({item}) => <PlacementItem item={item} />;
  const _onRefresh = async () => {
    setRefreshing(true);
    await dispatch(FetchPlacementListRequest());
    setRefreshing(false);
  };
  const _loadMore = () => {
    dispatch(LoadMorePlacementRequest());
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
