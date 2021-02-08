import React, {PureComponent} from 'react';
import {Alert, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Avatar, Button, Image, Overlay, Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  ToggleLikePostRequest,
  DeletePostRequest,
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
      isLiked: false,
      visible: false,
      lines: 0,
      textShown: false,
    };
  }

  componentDidMount() {
    this.setState({
      count: this.props.item.likedBy.length,
      isLiked: this.props.item.isLiked,
      visible: false,
      lines: 0,
      textShown: false,
    });
    if (this.props.item.isLiked) this.animation.play(43, 43);
    else this.animation.play(11, 11);
  }

  render() {
    const {
      _onPressAvatar,
      _onPressComment,
      _onPressDelete,
      _onPressLike,
    } = getEventHandlers(
      this.props.dispatch,
      this.props.index,
      this.state.isLiked,
      this.props.item.isSelf,
      this.props.onDeletePost,
      this.props.item.postId,
      this.props.item.uid,
    );
    const _toggleVisible = () => {
      this.setState({...this.state, visible: !this.state.visible});
    };
    const _onTextLayout = (ref) => {
      this.setState({...this.state, lines: ref.nativeEvent.lines.length});
    };
    const _onPressReadMore = () => {
      this.setState({...this.state, textShown: true});
    };
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
          {this.props.delete && this.props.item.isSelf ? (
            <>
              <Overlay
                isVisible={this.state.visible}
                overlayStyle={{borderRadius: widthPercentageToDP(2)}}
                onBackdropPress={_toggleVisible}>
                <View
                  style={{
                    width: widthPercentageToDP(40),
                    height: heightPercentageToDP(10),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Button
                    type="clear"
                    title="Edit post"
                    titleStyle={{color: 'black', fontWeight: '100'}}
                  />
                  <Button
                    type="clear"
                    title="Delete post"
                    titleStyle={{color: 'black', fontWeight: '100'}}
                    onPress={_onPressDelete}
                  />
                </View>
              </Overlay>
              <View style={styles.rightComponent}>
                <TouchableOpacity onPress={_toggleVisible}>
                  <Icon name="more-vert" size={fontscale(24)} />
                </TouchableOpacity>
              </View>
            </>
          ) : null}
        </View>
        {this.props.item.text ? (
          <>
            <Text
              style={{
                fontSize: fontscale(16),
                marginTop: heightPercentageToDP(2),
                marginStart: widthPercentageToDP(4),
              }}
              onTextLayout={_onTextLayout}
              numberOfLines={this.state.textShown ? this.state.lines : 4}>
              {this.props.item.text}
            </Text>
            {this.state.lines > 4 && !this.state.textShown ? (
              <Text
                onPress={_onPressReadMore}
                style={{
                  fontSize: fontscale(13),
                  color: 'grey',
                  marginTop: heightPercentageToDP(1),
                  marginStart: widthPercentageToDP(4),
                }}>
                Read More
              </Text>
            ) : null}
          </>
        ) : null}
        {this.props.item.image ? (
          <Image
            source={{uri: this.props.item.image}}
            style={{
              width: widthPercentageToDP(90),
              height: this.props.item.scale * widthPercentageToDP(90),
              resizeMode: 'cover',
              marginTop: heightPercentageToDP(1),
              marginBottom: heightPercentageToDP(1),
              borderRadius: widthPercentageToDP(3),
            }}
          />
        ) : null}
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => {
              _onPressLike();
              if (this.state.isLiked) {
                this.animation.play(0, 17);
                this.setState({
                  ...this.state,
                  count: this.state.count - 1,
                  isLiked: !this.state.isLiked,
                });
              } else {
                this.animation.play(25, 60);
                this.setState({
                  ...this.state,
                  count: this.state.count + 1,
                  isLiked: !this.state.isLiked,
                });
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
            <TouchableOpacity onPress={_onPressComment}>
              <Icon
                name="chat-bubble-outline"
                size={fontscale(22)}
                style={{transform: [{rotateY: '180deg'}]}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

function getEventHandlers(
  dispatch,
  index,
  isLiked,
  isSelf,
  onDeletePost,
  postId,
  uid,
) {
  const _onPressAvatar = async () => {
    if (isSelf) navigation.push('Profile');
    else
      navigation.push('ProfileX', {
        uid: uid,
      });
  };
  const _onPressDelete = () => {
    Alert.alert('Delete post', 'Post will be permanently deleted', [
      {
        text: 'Cancel',
        onPress: null,
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          await dispatch(DeletePostRequest(postId));
          onDeletePost && onDeletePost(index);
        },
      },
    ]);
  };
  const _onPressComment = async () => {
    navigation.push('AddComment', {postId: postId, uid: uid});
  };
  const _onPressLike = async () => {
    await dispatch(ToggleLikePostRequest(uid, postId, isLiked));
  };
  return {
    _onPressAvatar,
    _onPressComment,
    _onPressDelete,
    _onPressLike,
  };
}

const styles = StyleSheet.create({
  container: {
    margin: widthPercentageToDP(3),
    paddingBottom: 0,
    padding: widthPercentageToDP(2),
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
