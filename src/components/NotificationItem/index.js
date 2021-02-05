import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Avatar, Divider, Text} from 'react-native-elements';
import moment from 'moment';
import {
  fontscale,
  heightPercentageToDP,
  notificationTypes,
  widthPercentageToDP,
} from '../../constants';
import {navigation} from '../../navigations/RootNavigation';

const NotificationItem = ({item}) => {
  const {_getNotificationText, _onPress, _onPressAvatar} = getEventHandlers(
    item.type,
    item.from,
    item.postId,
  );
  return (
    <>
      <View style={styles.container}>
        <View style={styles.row}>
          <View>
            <Avatar
              rounded
              size={fontscale(50)}
              source={item.userInfo.avatar ? {uri: item.userInfo.avatar} : null}
              title={!item.userInfo.avatar ? item.userInfo.initials : null}
              onPress={_onPressAvatar}
              titleStyle={{fontSize: fontscale(17)}}
              containerStyle={{backgroundColor: '#523'}}
            />
          </View>
          <TouchableOpacity onPress={_onPress}>
            <View
              style={{
                marginStart: widthPercentageToDP(3),
                marginEnd: widthPercentageToDP(13.2),
              }}>
              <Text style={styles.name}>
                {item.userInfo.name + _getNotificationText()}
              </Text>
              <Text style={styles.text}>
                {moment(item.created_at).fromNow() == 'a few seconds ago'
                  ? 'Just now'
                  : moment(item.created_at).fromNow()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          paddingStart: widthPercentageToDP(20),
          paddingEnd: widthPercentageToDP(6),
          marginTop: heightPercentageToDP(1),
        }}>
        <Divider style={{backgroundColor: 'black', height: 1}} />
      </View>
    </>
  );
};

function getEventHandlers(type, uid, pid) {
  const _onPress = () => {
    switch (type) {
      case notificationTypes.LIKE_MY_POST:
      case notificationTypes.SOMEONE_POSTS:
      case notificationTypes.COMMENT_MY_POST:
        navigation.push('Post', {pid: pid});
        break;
      case notificationTypes.FOLLOWED_ME:
        navigation.push('ProfileX', {uid: uid});
    }
  };
  const _onPressAvatar = () => {
    navigation.push('ProfileX', {uid: uid});
  };
  const _getNotificationText = () => {
    switch (type) {
      case notificationTypes.LIKE_MY_POST:
        return ' liked your post.';
      case notificationTypes.SOMEONE_POSTS:
        return ' shared a post';
      case notificationTypes.COMMENT_MY_POST:
        return ' commented on your post';
      case notificationTypes.FOLLOWED_ME:
        return ' started following you';
      default:
        return '';
    }
  };
  return {
    _onPress,
    _onPressAvatar,
    _getNotificationText,
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

export default NotificationItem;
