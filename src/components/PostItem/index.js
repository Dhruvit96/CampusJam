import React, {PureComponent} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Avatar, Button, Image, Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
import {connect} from 'react-redux';
import {navigation} from '../../navigations/RootNavigation';

class PostItem extends PureComponent {
  constructor() {
    super();
    this.state = {
      count: 0,
      isFollowed: false,
    };
  }

  componentDidMount() {
    this.setState({
      count: this.props.item.likedBy.length,
      isFollowed: this.props.item.isFollowed,
    });
    if (this.props.item.isLiked) this.animation.play(43, 43);
    else this.animation.play(11, 11);
  }

  render() {
    const {_onPressAvatar, _onPressLike, _onPressFollow} = getEventHandlers(
      this.props.dispatch,
      this.props.item.uid,
      this.props.item.postId,
      this.props.item.isLiked,
      this.props.item.isFollowed,
      this.props.item.isSelf,
    );
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View>
            <Avatar
              rounded
              size={fontscale(50)}
              source={
                this.props.item.avatar ? {uri: this.props.item.avatar} : null
              }
              title={!this.props.item.avatar ? this.props.item.initials : null}
              onPress={
                typeof this.props.profileX === 'undefined'
                  ? _onPressAvatar
                  : null
              }
              titleStyle={{fontSize: fontscale(17)}}
              containerStyle={{backgroundColor: '#523'}}
            />
          </View>
          <View style={{marginStart: widthPercentageToDP(3)}}>
            <Text style={styles.name}>{this.props.item.name}</Text>
            <Text style={styles.text}>
              {moment(this.props.item.created_at).fromNow() ==
              'a few seconds ago'
                ? 'Just now'
                : moment(this.props.item.created_at).fromNow()}
            </Text>
          </View>
          {!this.props.item.isSelf ? (
            <View style={styles.rightComponent}>
              <Button
                type="clear"
                onPress={() => {
                  _onPressFollow();
                  this.setState({isFollowed: !this.state.isFollowed});
                }}
                title={this.state.isFollowed ? 'Following' : 'Follow'}
                containerStyle={{
                  width: widthPercentageToDP(25),
                  backgroundColor: this.state.isFollowed
                    ? '#f3f3f3'
                    : '#61c0ff',
                }}
                titleStyle={{
                  color: this.state.isFollowed ? '#61c0ff' : '#f3f3f3',
                }}
              />
            </View>
          ) : null}
        </View>
        {this.props.item.text ? (
          <Text style={{...styles.text, marginTop: heightPercentageToDP(2)}}>
            {this.props.item.text}
          </Text>
        ) : null}
        <Image
          source={{uri: this.props.item.image}}
          style={{
            width: widthPercentageToDP(84),
            height: this.props.item.scale * widthPercentageToDP(84),
            resizeMode: 'cover',
            marginTop: heightPercentageToDP(1),
            marginBottom: heightPercentageToDP(1),
            borderRadius: widthPercentageToDP(3),
          }}
        />
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => {
              _onPressLike();
              if (this.props.item.isLiked) {
                this.animation.play(0, 17);
                this.setState({count: this.state.count - 1});
              } else {
                this.animation.play(25, 60);
                this.setState({count: this.state.count + 1});
              }
            }}>
            <LottieView
              source={require('../../assets/animations/like-animation.json')}
              style={styles.heart}
              autoPlay={false}
              loop={false}
              ref={(animation) => {
                this.animation = animation;
              }}
            />
          </TouchableOpacity>
          <Text style={{...styles.text, marginStart: widthPercentageToDP(2)}}>
            {this.state.count}
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
  }
}

function getEventHandlers(dispatch, uid, postId, isLiked, isFollowed, isSelf) {
  const _onPressAvatar = async () => {
    if (isSelf) navigation.push('Profile');
    else
      navigation.push('ProfileX', {
        uid: uid,
      });
  };
  const _onPressLike = async () => {
    await dispatch(ToggleLikePostRequest(uid, postId, isLiked));
  };
  const _onPressFollow = async () => {
    await dispatch(ToggleFollowUserRequest(uid, isFollowed));
  };
  return {
    _onPressAvatar,
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

export default connect()(PostItem);
