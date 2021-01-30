import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Avatar, Button, Image, Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch} from 'react-redux';
import {
  ToggleFollowUserRequest,
  ToggleLikePostRequest,
} from '../../actions/postActions';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';

const PostItem = ({item}) => {
  const dispatch = useDispatch();
  const animation = useRef(null);
  const [isFirstRun, setIsFirstRun] = useState(true);
  useEffect(() => {
    if (isFirstRun) {
      if (item.isLiked) animation.current.play(43, 43);
      else animation.current.play(11, 11);
      setIsFirstRun(false);
    } else {
      if (item.isLiked) animation.current.play(25, 60);
      else animation.current.play(0, 17);
    }
  }, [item.isLiked]);

  const {_onPressLike, _onPressFollow} = getEventHandlers(
    dispatch,
    item.uid,
    item.postId,
    item.isLiked,
    item.isFollowed,
  );

  return (
    <View style={styles.container}>
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
          <Text style={styles.text}>
            {moment(item.created_at).fromNow() == 'a few seconds ago'
              ? 'Just now'
              : moment(item.created_at).fromNow()}
          </Text>
        </View>
        {!item.isSelf ? (
          <View style={styles.rightComponent}>
            <Button
              type="clear"
              onPress={() => _onPressFollow()}
              title={item.isFollowed ? 'Following' : 'Follow'}
              containerStyle={{
                width: widthPercentageToDP(25),
                backgroundColor: '#f3f3f3',
              }}
              titleStyle={{color: '#61c0ff'}}
            />
          </View>
        ) : null}
      </View>
      {item.text ? (
        <Text style={{...styles.text, marginTop: heightPercentageToDP(2)}}>
          {item.text}
        </Text>
      ) : null}
      <Image
        source={{uri: item.image}}
        style={{
          width: widthPercentageToDP(84),
          height: item.scale * widthPercentageToDP(84),
          resizeMode: 'cover',
          marginTop: heightPercentageToDP(1),
          marginBottom: heightPercentageToDP(1),
          borderRadius: widthPercentageToDP(3),
        }}
      />
      <View style={styles.row}>
        <TouchableOpacity onPress={() => _onPressLike()}>
          <LottieView
            source={require('../../assets/animations/like-animation.json')}
            style={styles.heart}
            autoPlay={false}
            loop={false}
            ref={animation}
          />
        </TouchableOpacity>
        <Text style={{...styles.text, marginStart: widthPercentageToDP(2)}}>
          {item.likedBy.length}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            ...styles.rightComponent,
          }}>
          <Icon
            name="chat-bubble-outline"
            size={fontscale(22)}
            style={{transform: [{rotateY: '180deg'}]}}
          />
        </View>
      </View>
    </View>
  );
};

function getEventHandlers(dispatch, uid, postId, isLiked, isFollowed) {
  const _onPressLike = async () => {
    await dispatch(ToggleLikePostRequest(uid, postId, isLiked));
  };
  const _onPressFollow = async () => {
    await dispatch(ToggleFollowUserRequest(uid, isFollowed));
  };
  return {
    _onPressLike,
    _onPressFollow,
  };
}

const styles = StyleSheet.create({
  container: {
    margin: widthPercentageToDP(4),
    paddingBottom: 0,
    padding: widthPercentageToDP(4),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    borderRadius: widthPercentageToDP(2),
    backgroundColor: 'white',
  },
  name: {
    fontSize: fontscale(16),
  },
  heart: {
    height: widthPercentageToDP(14),
    marginEnd: -widthPercentageToDP(2),
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightComponent: {
    position: 'absolute',
    end: 0,
    alignSelf: 'center',
  },
  text: {
    fontSize: fontscale(13),
  },
});

export default PostItem;
