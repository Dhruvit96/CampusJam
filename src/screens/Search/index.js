import React, {useState} from 'react';
import {Header, Icon, Text} from 'react-native-elements';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StatusBar,
  TextInput,
  View,
} from 'react-native';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
import {navigation} from '../../navigations/RootNavigation';
import firestore from '@react-native-firebase/firestore';
import SearchItem from '../../components/SearchItem';
const Search = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const {_renderItem, _renderEmpty, _searchUser} = getEventHandlers(
    loading,
    query,
    setQuery,
    setUserData,
    setLoading,
  );
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar barStyle="dark-content" />
      <Header
        backgroundColor="transparent"
        placement="center"
        leftComponent={{
          icon: 'arrow-back',
          color: '#000',
          size: fontscale(24),
          onPress: () => {
            navigation.goBack();
          },
        }}
        centerComponent={{
          text: 'Search',
          style: {color: '#61c0ff', fontSize: fontscale(24)},
        }}
      />
      <View
        style={{
          height: fontscale(42),
          margin: widthPercentageToDP(5),
          marginBottom: 0,
          borderRadius: widthPercentageToDP(12),
          borderWidth: widthPercentageToDP(0.2),
          paddingStart: widthPercentageToDP(4.5),
          paddingEnd: widthPercentageToDP(4),
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TextInput
          placeholder="Type Here..."
          style={{flex: 1, fontSize: fontscale(15)}}
          onChangeText={_searchUser}
        />
        <Icon name="search" color="#61c0ff" />
      </View>
      {query.length != 0 ? (
        <FlatList
          data={userData}
          keyExtractor={(item) => item.uid}
          renderItem={_renderItem}
          ListEmptyComponent={_renderEmpty}
        />
      ) : null}
    </View>
  );
};

function getEventHandlers(loading, query, setQuery, setUserData, setLoading) {
  const _searchUser = async (txt) => {
    try {
      setQuery(txt);
      let text = txt.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
      if (txt.length == 0) setUserData([]);
      else {
        setLoading(true);
        let userData1 = await firestore()
          .collection('users')
          .where('name', '>=', text)
          .where('name', '<=', text + '\uf8ff')
          .get();
        let userData2 = await firestore()
          .collection('users')
          .where('id', '>=', text.toUpperCase())
          .where('id', '<=', text.toUpperCase() + '\uf8ff')
          .get();
        let users = [];
        let ids = [];
        await Promise.all(
          userData1.docs.map((doc) => {
            let data = doc.data();
            ids.push(doc.id);
            return users.push({
              avatar: data.avatar,
              id: data.id,
              initials: data.initials,
              name: data.name,
              uid: doc.id,
            });
          }),
        );
        await Promise.all(
          userData2.docs.map((doc) => {
            let data = doc.data();
            if (ids.indexOf(doc.id) > 0) return;
            return users.push({
              avatar: data.avatar,
              id: data.id,
              initials: data.initials,
              name: data.name,
              uid: doc.id,
            });
          }),
        );
        setUserData(users);
      }
      setLoading(false);
    } catch (e) {
      console.warn(e);
      Alert.alert('Error', 'Can not Search at time');
    }
  };
  const _renderEmpty = () =>
    loading ? (
      <View
        style={{
          alignItems: 'center',
          marginTop: heightPercentageToDP(2),
          marginStart: widthPercentageToDP(6),
          flexDirection: 'row',
        }}>
        <ActivityIndicator size="small" color="#000" />
        <Text
          style={{
            fontSize: fontscale(15),
            marginStart: widthPercentageToDP(3),
          }}>
          {'Searching for ' + query + '.'}
        </Text>
      </View>
    ) : (
      <Text
        style={{
          fontSize: fontscale(15),
          marginTop: heightPercentageToDP(2),
          marginStart: widthPercentageToDP(6),
        }}>
        No user found with this name or id.
      </Text>
    );
  const _renderItem = ({item}) => <SearchItem item={item} />;

  return {
    _renderEmpty,
    _renderItem,
    _searchUser,
  };
}

export default Search;
