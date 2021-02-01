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

const NotificationItem = ({item}) => {
  const {_getNotificationText} = getEventHandlers(item.type);

  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.row}>
          <View>
            <Avatar
              rounded
              size={fontscale(50)}
              source={item.userInfo.avatar ? {uri: item.userInfo.avatar} : null}
              title={!item.userInfo.avatar ? item.userInfo.initials : null}
              titleStyle={{fontSize: fontscale(17)}}
              containerStyle={{backgroundColor: '#523'}}
            />
          </View>
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
    </TouchableOpacity>
  );
};

function getEventHandlers(type) {
  const _onPress = async () => {
    switch (type) {
      case notificationTypes.LIKE_MY_POST:
      case notificationTypes.SOMEONE_POSTS:
      case notificationTypes.COMMENT_MY_POST:
      //move to post
      case notificationTypes.FOLLOWED_ME:
      //move to profile
      default:
      //do nothing
    }
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
