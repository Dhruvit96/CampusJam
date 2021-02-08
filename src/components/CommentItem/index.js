import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar, Button, Text} from 'react-native-elements';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
import {useSelector} from '../../store';
import {navigation} from '../../navigations/RootNavigation';

const CommentItem = ({item, style, onPressReply}) => {
  const uid = useSelector((state) => state.user.userInfo.uid);
  const isSelf = uid === item.uid;
  const {_onPressAvatar} = getEventHandlers(item.uid, isSelf);
  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <View>
          <Avatar
            rounded
            size={fontscale(50)}
            onPress={_onPressAvatar}
            source={item.avatar ? {uri: item.avatar} : null}
            title={!item.avatar ? item.initials : null}
            titleStyle={{fontSize: fontscale(17)}}
            containerStyle={{backgroundColor: '#523'}}
          />
        </View>
        <View style={{marginStart: widthPercentageToDP(3)}}>
          <Text style={styles.name}>{item.name}</Text>
          <Text
            style={[
              styles.text,
              {
                width: style
                  ? widthPercentageToDP(43)
                  : widthPercentageToDP(58),
              },
            ]}>
            {item.text}
          </Text>
        </View>
        <View style={styles.rightComponent}>
          <Button
            type="clear"
            title="Reply"
            onPress={onPressReply}
            titleStyle={{color: 'grey'}}
          />
        </View>
      </View>
    </View>
  );
};

function getEventHandlers(uid, isSelf) {
  const _onPressAvatar = () => {
    !isSelf
      ? navigation.push('ProfileX', {uid: uid})
      : navigation.push('Profile');
    navigation.goBack();
  };
  return {
    _onPressAvatar,
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
  rightComponent: {
    position: 'absolute',
    end: 0,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  text: {
    fontSize: fontscale(13),
    color: '#6a6a6a',
  },
});

export default CommentItem;
