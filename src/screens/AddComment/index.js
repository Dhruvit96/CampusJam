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
import {CreateNotificationRequest} from '../../actions/notificationActions.js';
import {PostRequestFailure} from '../../actions/postActions.js';

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
  const [commentsData, setCommentData] = useState([]);
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
    commentsData,
    dispatch,
    postId,
    replyId,
    replyTo,
    setComment,
    setCommentData,
    setLoading,
    setRefreshing,
    setReplyTo,
    setReplyId,
    user.uid,
    user,
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
  commentsData,
  dispatch,
  postId,
  replyId,
  replyTo,
  setComment,
  setCommentData,
  setLoading,
  setRefreshing,
  setReplyTo,
  setReplyId,
  uid,
  user,
  userId,
) {
  const _onPressBack = () => {
    navigation.goBack();
  };
  const _onRefresh = async () => {
    setRefreshing(true);
    let comments = await firestore()
      .collection('comments')
      .where('postId', '==', postId)
      .orderBy('create_at', 'desc')
      .get();
    let commentData = [];
    await Promise.all(
      comments.docs.map(async (doc) => {
        let data = doc.data();
        let replies = await firestore()
          .collection('comments')
          .doc(`${doc.id}`)
          .collection('replies')
          .orderBy('create_at', 'asc')
          .get();
        let repliesData = [];
        await Promise.all(
          replies.docs.map(async (ref) => {
            let replyData = ref.data();
            let userData = await firestore()
              .collection('users')
              .doc(replyData.uid)
              .get();
            userData = userData.data();
            return repliesData.push({
              ...replyData,
              avatar: userData.avatar,
              commentId: doc.id,
              initials: userData.initials,
              name: userData.name,
              replyId: ref.id,
            });
          }),
        );
        let userData = await firestore()
          .collection('users')
          .doc(data.uid)
          .get();
        userData = userData.data();
        return commentData.push({
          title: {
            ...data,
            avatar: userData.avatar,
            initials: userData.initials,
            name: userData.name,
            commentId: doc.id,
          },
          data: repliesData,
        });
      }),
    );
    setCommentData(commentData);
    setRefreshing(false);
  };
  const _renderEmpty = () => <EmptyList message={'No comments'} />;

  const _addComment = async () => {
    try {
      setLoading(true);
      if (replyTo.length == 0) {
        await firestore()
          .collection('comments')
          .add({
            uid: uid,
            text: comment,
            postId: postId,
            create_at: Date.now(),
            replies: [],
          })
          .then((doc) => {
            let data = {
              title: {
                uid: uid,
                text: comment,
                postId: postId,
                create_at: Date.now(),
                avatar: user.avatar,
                initials: user.initials,
                name: user.name,
                commentId: doc.id,
              },
              data: [],
            };
            setCommentData([data, ...commentsData]);
          });
        if (userId != uid)
          dispatch(
            CreateNotificationRequest({
              postId: postId,
              userIds: [userId],
              from: uid,
              created_at: Date.now(),
              type: notificationTypes.COMMENT_MY_POST,
            }),
          );
      } else {
        await firestore()
          .collection('comments')
          .doc(`${replyId.commentId}`)
          .collection('replies')
          .add({
            uid: uid,
            text: comment,
            create_at: Date.now(),
          })
          .then(async (doc) => {
            await firestore()
              .collection('comments')
              .doc(`${replyId.commentId}`)
              .update({replies: FieldValue.arrayUnion(uid)});
            let index = 0;
            let data = commentsData.filter((ref, i) => {
              if (ref.title.commentId == replyId.commentId) {
                index = i;
                return true;
              } else return false;
            })[0];
            data.data = [
              ...data.data,
              {
                uid: uid,
                text: comment,
                create_at: Date.now(),
                avatar: user.avatar,
                initials: user.initials,
                name: user.name,
                commentId: doc.id,
              },
            ];
            setCommentData([
              ...commentsData.slice(0, index),
              data,
              ...commentsData.slice(index + 1),
            ]);
          });
        if (userId != uid && userId != replyId.uid)
          dispatch(
            CreateNotificationRequest({
              postId: postId,
              userIds: [userId],
              from: uid,
              created_at: Date.now(),
              type: notificationTypes.COMMENT_MY_POST,
            }),
          );
        if (replyId.uid != uid)
          dispatch(
            CreateNotificationRequest({
              postId: postId,
              userIds: [replyId.uid],
              from: uid,
              created_at: Date.now(),
              type: notificationTypes.REPLIED_COMMENT,
            }),
          );
      }
      setComment('');
      setReplyTo('');
      setLoading(false);
    } catch (e) {
      console.warn(e);
      dispatch(PostRequestFailure('Can not add comment'));
    }
  };
  const _renderItem = ({item}) => (
    <CommentItem
      item={item}
      style={styles.reply}
      onPressReply={() => _onPressReply(item)}
    />
  );
  const _renderSectionHeader = ({section: {title}}) => (
    <CommentItem item={title} onPressReply={() => _onPressReply(title)} />
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
