import React, {useEffect, useState} from 'react';
import {SectionList, StatusBar, Text, View} from 'react-native';
import {Header} from 'react-native-elements';
import EmptyList from '../../components/EmptyList';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
import LottieView from 'lottie-react-native';
import {dispatch, navigation} from '../../navigations/RootNavigation';
import EventItem from '../../components/EventItem';
import {useSelector} from '../../store';
import {useDispatch} from 'react-redux';
import {
  FetchEventsRequest,
  LoadMoreEventsRequest,
} from '../../actions/studentDataActions';

const Events = () => {
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const eventsData = useSelector((state) => state.studentData.events);
  const loaded = useSelector((state) => state.studentData.loadedEvents);
  const [first, setFirst] = useState(true);
  const {
    _loadMore,
    _onPressBack,
    _onRefresh,
    _renderEmpty,
    _renderFooter,
    _renderItem,
    _renderSectionHeader,
  } = getEventHandlers(dispatch, loaded, refreshing, setRefreshing);
  useEffect(() => {
    async function fetchData() {
      await _onRefresh();
      setFirst(false);
    }
    fetchData();
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
          text: 'Events',
          style: {color: '#000', fontSize: fontscale(24)},
        }}
      />
      <SectionList
        sections={eventsData}
        keyExtractor={(item) => item.id}
        renderItem={_renderItem}
        refreshing={refreshing}
        onEndReachedThreshold={0.5}
        onRefresh={() => {}}
        onEndReached={loaded ? null : _loadMore}
        ListFooterComponent={_renderFooter}
        ListEmptyComponent={first ? null : _renderEmpty}
        renderSectionHeader={_renderSectionHeader}
      />
    </View>
  );
};

function getEventHandlers(dispatch, loaded, refreshing, setRefreshing) {
  const _onPressBack = () => {
    navigation.goBack();
  };
  const _onRefresh = async () => {
    setRefreshing(true);
    await dispatch(FetchEventsRequest());
    setRefreshing(false);
  };
  const _renderEmpty = () => <EmptyList message={'No Events'} />;
  const _renderItem = ({item}) => <EventItem item={item} />;
  const _loadMore = () => {
    dispatch(LoadMoreEventsRequest());
  };
  const _renderSectionHeader = ({section: {title}}) => (
    <Text
      style={{
        padding: widthPercentageToDP(2),
        alignSelf: 'center',
        fontSize: fontscale(17),
      }}>
      {title}
    </Text>
  );
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
  return {
    _loadMore,
    _onPressBack,
    _onRefresh,
    _renderEmpty,
    _renderFooter,
    _renderItem,
    _renderSectionHeader,
  };
}

export default Events;
