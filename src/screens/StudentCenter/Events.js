import React, {useEffect, useState} from 'react';
import {
  Alert,
  SectionList,
  StyleSheet,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {Header} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import EmptyList from '../../components/EmptyList';
import {
  findWithAttr,
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import {navigation} from '../../navigations/RootNavigation';

const Events = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [eventsData, setEventsData] = useState([]);
  const [last, setLast] = useState();
  const LIMIT = 20;
  const [loaded, setLoaded] = useState(false);
  const [first, setFirst] = useState(true);
  const {
    _loadMore,
    _onPressBack,
    _onRefresh,
    _renderEmpty,
    _renderFooter,
    _renderItem,
    _renderSectionHeader,
  } = getEventHandlers(
    eventsData,
    last,
    LIMIT,
    loaded,
    refreshing,
    setEventsData,
    setRefreshing,
    setLast,
    setLoaded,
  );
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

function getEventHandlers(
  data,
  last,
  LIMIT,
  loaded,
  refreshing,
  setEvents,
  setRefreshing,
  setLast,
  setLoaded,
) {
  const _onPressBack = () => {
    navigation.goBack();
  };
  const _onRefresh = async () => {
    try {
      setRefreshing(true);
      let today = (Date.now() / 100000) * 100000;
      let events = await firestore()
        .collection('events')
        .where('date', '>=', today)
        .orderBy('date', 'asc')
        .orderBy('order', 'asc')
        .limit(LIMIT)
        .get();
      setLast(events.docs[events.size - 1]);
      let eventsData = [];
      await Promise.all(
        events.docs.map((doc) => {
          let data = doc.data();
          let eventDate = moment(data.date).format('Do MMMM YYYY');
          let index = findWithAttr(eventsData, 'title', eventDate);
          if (index >= 0) {
            eventsData = [
              ...eventsData.slice(0, index),
              {
                ...eventsData[index],
                data: [...eventsData[index].data, {...data, id: doc.id}],
              },
              ...eventsData.slice(index + 1),
            ];
            return;
          } else {
            return eventsData.push({
              title: eventDate,
              data: [{...data, id: doc.id}],
            });
          }
        }),
      );
      if (events.size < LIMIT) setLoaded(true);
      setEvents(eventsData);
      setRefreshing(false);
    } catch (e) {
      console.warn(e);
      Alert.alert('Error', 'Can not get data.');
    }
  };
  const _renderEmpty = () => <EmptyList message={'No Events'} />;
  const _renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.time}>{item.time}</Text>
      <Text style={styles.text}>{item.name}</Text>
      {item.details && <Text style={styles.details}>{item.details}</Text>}
    </View>
  );
  const _loadMore = async () => {
    try {
      let events = await firestore()
        .collection('events')
        .orderBy('date', 'asc')
        .orderBy('order', 'asc')
        .startAfter(last)
        .limit(LIMIT)
        .get();
      setLast(events.docs[events.size - 1]);
      let eventsData = data;
      await Promise.all(
        events.docs.map((doc) => {
          let data = doc.data();
          let eventDate = moment(data.date).format('Do MMMM YYYY');
          let index = findWithAttr(eventsData, 'title', eventDate);
          if (index >= 0) {
            eventsData = [
              ...eventsData.slice(0, index),
              {
                ...eventsData[index],
                data: [...eventsData[index].data, {...data, id: doc.id}],
              },
              ...eventsData.slice(index + 1),
            ];
            return;
          } else {
            return eventsData.push({
              title: eventDate,
              data: [{...data, id: doc.id}],
            });
          }
        }),
      );
      if (events.size < LIMIT) setLoaded(true);
      setEvents(eventsData);
    } catch (e) {
      console.warn(e);
      Alert.alert('Error', 'Can not get data.');
    }
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  itemContainer: {
    margin: widthPercentageToDP(3),
    marginBottom: widthPercentageToDP(1),
    padding: widthPercentageToDP(4),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: widthPercentageToDP(2),
    backgroundColor: 'white',
  },
  details: {
    fontSize: fontscale(13.5),
  },
  text: {
    fontSize: fontscale(14),
    marginTop: widthPercentageToDP(1),
    marginBottom: widthPercentageToDP(1),
  },
  time: {
    fontSize: fontscale(13),
  },
});

export default Events;
