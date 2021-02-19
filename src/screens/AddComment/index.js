import React, {useEffect, useState} from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  SectionList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Avatar, Button, Header, Icon, Text} from 'react-native-elements';
import CommentItem from '../../components/CommentItem/index.js';
import {
  FieldValue,
  fontscale,
  heightPercentageToDP,
  notificationTypes,
  widthPercentageToDP,
} from '../../constants';
import firestore from '@react-native-firebase/firestore';
import EmptyList from '../../components/EmptyList';
import {navigation} from '../../navigations/RootNavigation';
import {useSelector} from '../../store.js';
import {useDispatch} from 'react-redux';
import {
  CreateNotificationRequest,
  DeleteNotificationRequest,
} from '../../actions/notificationActions.js';
import {PostRequestFailure} from '../../actions/postActions.js';
import {
  AddCommentRequest,
  DeleteCommentRequest,
  FetchCommentListRequest,
} from '../../actions/commentActions.js';

const AddComment = ({route}) => {
  const postId = route.params.postId;
  const userId = route.params.uid;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  const [replyTo, setReplyTo] = useState('');
  const [replyId, setReplyId] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [first, setFirst] = useState(true);
  const commentsData = useSelector(
    (state) => state.comment[route.params.postId],
  );
  const [comment, setComment] = useState('');
  const {
    _addComment,
    _onPressBack,
    _onRefresh,
    _renderEmpty,
    _renderItem,
    _renderSectionHeader,
  } = getEventHandlers(
    comment,
    dispatch,
    postId,
    replyId,
    replyTo,
    setComment,
    setLoading,
    setRefreshing,
    setReplyTo,
    setReplyId,
    userId,
  );
  useEffect(() => {
    async function fetchData() {
      await _onRefresh();
      setFirst(false);
    }
    fetchData();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        backgroundColor="transparent"
        placement="center"
        leftComponent={{
          icon: 'arrow-back',
          color: '#000',
          size: fontscale(27),
          onPress: _onPressBack,
        }}
        centerComponent={{
          text: 'Comments',
          style: {color: '#61c0ff', fontSize: fontscale(24)},
        }}
      />
      <SectionList
        sections={commentsData}
        keyExtractor={(item) => (item.replyId ? item.replyId : item.commentId)}
        renderItem={_renderItem}
        refreshing={refreshing}
        ListEmptyComponent={first ? null : _renderEmpty}
        onRefresh={_onRefresh}
        renderSectionHeader={_renderSectionHeader}
      />
      {replyTo.length != 0 ? (
        <View style={styles.replyToContainer}>
          <Text style={{fontSize: fontscale(14)}}>
            {'Replying to ' + replyTo + '.'}
          </Text>
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={() => setReplyTo('')}>
            <Icon name="close" />
          </TouchableOpacity>
        </View>
      ) : null}
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Avatar
          rounded
          size={fontscale(45)}
          source={user.avatar ? {uri: user.avatar} : null}
          title={!user.avatar ? user.initials : null}
          titleStyle={{fontSize: fontscale(17)}}
          containerStyle={{
            backgroundColor: '#523',
            marginStart: widthPercentageToDP(2),
          }}
        />
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type Here..."
            value={comment}
            style={{flex: 1, fontSize: fontscale(15)}}
            onChangeText={(text) => setComment(text)}
          />
          <Button
            title="Post"
            disabled={comment.length == 0}
            onPress={_addComment}
            loading={loading}
            type="clear"
            titleStyle={{color: '#61c0ff'}}
          />
        </View>
      </View>
    </View>
  );
};

function getEventHandlers(
  comment,
  dispatch,
  postId,
  replyId,
  replyTo,
  setComment,
  setLoading,
  setRefreshing,
  setReplyTo,
  setReplyId,
  userId,
) {
  const _onPressBack = () => {
    navigation.goBack();
  };
  const _onRefresh = async () => {
    setRefreshing(true);
    await dispatch(FetchCommentListRequest(postId));
    setRefreshing(false);
  };
  const _renderEmpty = () => <EmptyList message={'No comments'} />;

  const _addComment = async () => {
    setLoading(true);
    await dispatch(
      AddCommentRequest(comment, postId, replyId, replyTo, userId),
    );
    setComment('');
    setReplyTo('');
    setLoading(false);
  };
  const _renderItem = ({item}) => (
    <CommentItem
      item={item}
      style={styles.reply}
      onPressReply={() => _onPressReply(item)}
      onDeleteComment={_onDeleteComment}
    />
  );
  const _onDeleteComment = async (commentId, replyId) => {
    await dispatch(DeleteCommentRequest(postId, commentId, replyId, userId));
  };
  const _renderSectionHeader = ({section: {title}}) => (
    <CommentItem
      item={title}
      onPressReply={() => _onPressReply(title)}
      onDeleteComment={_onDeleteComment}
    />
  );
  const _onPressReply = (item) => {
    setReplyTo(item.name);
    setReplyId({commentId: item.commentId, uid: item.uid});
  };
  return {
    _addComment,
    _onPressBack,
    _onRefresh,
    _renderEmpty,
    _renderItem,
    _renderSectionHeader,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputContainer: {
    flex: 1,
    height: heightPercentageToDP(5.5),
    margin: widthPercentageToDP(5),
    marginStart: widthPercentageToDP(3),
    marginBottom: heightPercentageToDP(2),
    borderRadius: widthPercentageToDP(12),
    borderWidth: widthPercentageToDP(0.2),
    paddingStart: widthPercentageToDP(4.5),
    paddingEnd: widthPercentageToDP(4),
    flexDirection: 'row',
    alignItems: 'center',
  },
  reply: {marginStart: widthPercentageToDP(15)},
  replyToContainer: {
    marginStart: widthPercentageToDP(3),
    flexDirection: 'row',
  },
  rightIcon: {
    position: 'absolute',
    end: widthPercentageToDP(7),
    alignSelf: 'center',
  },
});
export default AddComment;
