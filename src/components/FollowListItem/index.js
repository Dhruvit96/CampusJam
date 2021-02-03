import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar, Button, Text} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {ToggleFollowUserRequest} from '../../actions/postActions';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
import {useSelector} from '../../store';
import {navigation} from '../../navigations/RootNavigation';

const FollowListItem = ({item}) => {
  const dispatch = useDispatch();
  const followings = useSelector((state) => state.user.userInfo.followings);
  const uid = useSelector((state) => state.user.userInfo.uid);
  const [isFollowed, setIsFollowed] = useState(
    followings.indexOf(item.uid) !== -1,
  );
  const isSelf = uid === item.uid;
  const {_onPressAvatar, _onPressFollow} = getEventHandlers(
    dispatch,
    item.uid,
    isFollowed,
    isSelf,
    setIsFollowed,
  );
  return (
    <>
      <View style={styles.container}>
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
            {item.id ? <Text style={styles.text}>{item.id}</Text> : null}
          </View>
          {!isSelf ? (
            <View style={styles.rightComponent}>
              <Button
                type="clear"
                onPress={_onPressFollow}
                title={isFollowed ? 'Following' : 'Follow'}
                containerStyle={{
                  width: widthPercentageToDP(25),
                  backgroundColor: isFollowed ? '#f3f3f3' : '#61c0ff',
                }}
                titleStyle={{color: isFollowed ? '#61c0ff' : '#f3f3f3'}}
              />
            </View>
          ) : null}
        </View>
      </View>
    </>
  );
};

function getEventHandlers(dispatch, uid, isFollowed, isSelf, setIsFollowed) {
  const _onPressAvatar = () => {
    !isSelf
      ? navigation.push('ProfileX', {uid: uid})
      : navigation.push('Profile');
  };
  const _onPressFollow = async () => {
    await dispatch(ToggleFollowUserRequest(uid, isFollowed));
    setIsFollowed(!isFollowed);
  };
  return {
    _onPressAvatar,
    _onPressFollow,
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
    alignSelf: 'center',
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

export default FollowListItem;
