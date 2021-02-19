import React from 'react';
import {Alert, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Avatar, Button, Text} from 'react-native-elements';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
import {useSelector} from '../../store';
import {navigation} from '../../navigations/RootNavigation';

const CommentItem = ({item, style, onDeleteComment, onPressReply}) => {
  const uid = useSelector((state) => state.user.userInfo.uid);
  const isSelf = uid === item.uid;
  const {_onLongPress, _onPressAvatar} = getEventHandlers(
    item.commentId,
    isSelf,
    onDeleteComment,
    item.replyId,
    item.uid,
  );
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      disabled={!isSelf}
      onLongPress={_onLongPress}>
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
          <TouchableOpacity onPress={_onPressAvatar}>
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
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
    </TouchableOpacity>
  );
};

function getEventHandlers(commentId, isSelf, onDeleteComment, replyId, uid) {
  const _onPressAvatar = () => {
    !isSelf
      ? navigation.push('ProfileX', {uid: uid})
      : navigation.push('Profile');
    navigation.goBack();
  };
  const _onLongPress = () => {
    Alert.alert('Delete comment', 'Comment will be permanently deleted', [
      {
        text: 'Cancel',
        onPress: null,
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          onDeleteComment && onDeleteComment(commentId, replyId);
        },
      },
    ]);
  };
  return {
    _onLongPress,
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
    fontSize: fontscale(14.5),
    color: '#6a6a6a',
  },
});

export default CommentItem;
