import React, {useEffect, useState} from 'react';
import {FlatList, StatusBar, View} from 'react-native';
import {Header} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {fontscale} from '../../constants';
import {useSelector} from '../../store';
import {FetchNotificationListRequest} from '../../actions/notificationActions';
import NotificationItem from '../../components/NotificationItem';
import EmptyList from '../../components/EmptyList';
const Notification = () => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const notificationData = useSelector((state) => state.notification);
  const {_onRefresh, _renderItem, _renderEmpty} = getEventHandlers(
    dispatch,
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
        centerComponent={{
          text: 'Notifications',
          style: {color: '#000', fontSize: fontscale(24)},
        }}
      />
      <FlatList
        data={notificationData}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        ListEmptyComponent={_renderEmpty}
        renderItem={_renderItem}
        onRefresh={_onRefresh}
      />
    </View>
  );
};

function getEventHandlers(dispatch, setRefreshing) {
  const _onRefresh = async () => {
    setRefreshing(true);
    await dispatch(FetchNotificationListRequest());
    setRefreshing(false);
  };
  const _renderItem = ({item, index}) => (
    <NotificationItem index={index} item={item} />
  );
  const _renderEmpty = () => <EmptyList message="No new notifications." />;
  return {
    _onRefresh,
    _renderItem,
    _renderEmpty,
  };
}

export default Notification;
