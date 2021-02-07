import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Avatar, Text} from 'react-native-elements';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
import {useSelector} from '../../store';
import {navigation} from '../../navigations/RootNavigation';

const SearchItem = ({item}) => {
  const uid = useSelector((state) => state.user.userInfo.uid);
  const isSelf = uid === item.uid;
  const {_onPress} = getEventHandlers(item.uid, isSelf);
  return (
    <TouchableOpacity style={styles.container} onPress={_onPress}>
      <View style={styles.row}>
        <View>
          <Avatar
            rounded
            size={fontscale(50)}
            source={item.avatar ? {uri: item.avatar} : null}
            title={!item.avatar ? item.initials : null}
            titleStyle={{fontSize: fontscale(17)}}
            containerStyle={{backgroundColor: '#523'}}
          />
        </View>
        <View style={{marginStart: widthPercentageToDP(3)}}>
          <Text style={styles.name}>{item.name}</Text>
          {item.id ? <Text style={styles.text}>{item.id}</Text> : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

function getEventHandlers(uid, isSelf) {
  const _onPress = () => {
    !isSelf
      ? navigation.push('ProfileX', {uid: uid})
      : navigation.push('Profile');
  };
  return {
    _onPress,
  };
}

const styles = StyleSheet.create({
  container: {
    margin: widthPercentageToDP(2),
    paddingBottom: 0,
    marginBottom: heightPercentageToDP(1),
    padding: widthPercentageToDP(3),
    flexDirection: 'row',
  },
  name: {
    fontSize: fontscale(16),
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: fontscale(13),
    color: '#6a6a6a',
  },
});

export default SearchItem;
