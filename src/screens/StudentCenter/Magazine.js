import React, {useEffect, useState} from 'react';
import {FlatList, StatusBar, View} from 'react-native';
import {Header} from 'react-native-elements';
import MagazineItem from '../../components/MagazineItem';
import {fontscale} from '../../constants';
import {navigation} from '../../navigations/RootNavigation';
import {FetchMagazineListRequest} from '../../actions/studentDataActions';
import {useDispatch} from 'react-redux';
import {useSelector} from '../../store';
const Magazine = () => {
  const [refreshing, setRefreshing] = useState(false);
  const magazineData = useSelector((state) => state.studentData.magazineData);
  const dispatch = useDispatch();
  const {_onPressBack, _onRefresh, _renderItem} = getEventHandlers(
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
        leftComponent={{
          icon: 'arrow-back',
          color: '#000',
          size: fontscale(27),
          onPress: _onPressBack,
        }}
        centerComponent={{
          text: 'Magazine',
          style: {color: '#000', fontSize: fontscale(24)},
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
function getEventHandlers(dispatch, setRefreshing) {
  const _onPressBack = () => {
    navigation.goBack();
  };
  const _renderItem = ({item}) => <MagazineItem item={item} />;
  const _onRefresh = async () => {
    setRefreshing(true);
    await dispatch(FetchMagazineListRequest());
    setRefreshing(false);
  };
  return {
    _onPressBack,
    _onRefresh,
    _renderItem,
  };
}

export default Magazine;
