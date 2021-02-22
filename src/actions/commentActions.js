import {commnetActionTypes, notificationTypes, FieldValue} from '../constants';
import firestore from '@react-native-firebase/firestore';
import {store} from '../store';
import {
  CreateNotificationRequest,
  DeleteNotificationRequest,
} from '../actions/notificationActions';

export const CommentRequestFailure = (message) => {
  return {
    type: commnetActionTypes.COMMENT_REQUEST_FAILURE,
    payload: {
      message,
    },
  };
};

export const FetchCommentListRequest = (postId) => {
  return async (dispatch) => {
    try {
      let comments = await firestore()
        .collection('comments')
        .where('postId', '==', postId)
        .orderBy('created_at', 'desc')
        .get();
      let commentData = [];
      await Promise.all(
        comments.docs.map(async (doc) => {
          let data = doc.data();
          let replies = await firestore()
            .collection('comments')
            .where('commentId', '==', doc.id)
            .orderBy('created_at', 'asc')
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
      dispatch(FetchCommentListSuccess(postId, commentData));
    } catch (e) {
      console.warn(e);
      dispatch(CommentRequestFailure('Get Comment List Failed!'));
    }
  };
};

export const FetchCommentListSuccess = (postId, data) => {
  return {
    type: commnetActionTypes.FETCH_COMMENT_LIST_SUCCESS,
    payload: {postId, data},
  };
};

export const AddCommentRequest = (
  comment,
  postId,
  replyId,
  replyTo,
  userId,
) => {
  return async (dispatch) => {
    try {
      const user = store.getState().user.userInfo;
      const time = Date.now();
      if (replyTo.length == 0) {
        await firestore()
          .collection('comments')
          .add({
            uid: user.uid,
            text: comment,
            postId: postId,
            created_at: time,
          })
          .then((doc) => {
            let data = {
              title: {
                uid: user.uid,
                text: comment,
                postId: postId,
                created_at: time,
                avatar: user.avatar,
                initials: user.initials,
                name: user.name,
                commentId: doc.id,
              },
              data: [],
            };
            dispatch(AddCommentSuccess(postId, data));
          });
        if (userId != user.uid)
          dispatch(
            CreateNotificationRequest({
              postId: postId,
              userIds: [userId],
              from: user.uid,
              created_at: time,
              type: notificationTypes.COMMENT_MY_POST,
            }),
          );
      } else {
        await firestore()
          .collection('comments')
          .add({
            uid: user.uid,
            text: comment,
            created_at: time,
            commentId: replyId.commentId,
          })
          .then(async (doc) => {
            dispatch(
              ReplyCommentSuccess(postId, replyId.commentId, {
                uid: user.uid,
                text: comment,
                created_at: time,
                avatar: user.avatar,
                initials: user.initials,
                name: user.name,
                replyId: doc.id,
                commentId: replyId.commentId,
              }),
            );
          });
        if (userId != user.uid && userId != replyId.uid)
          dispatch(
            CreateNotificationRequest({
              postId: postId,
              userIds: [userId],
              from: user.uid,
              created_at: time,
              type: notificationTypes.COMMENT_MY_POST,
            }),
          );
        if (replyId.uid != user.uid)
          dispatch(
            CreateNotificationRequest({
              postId: postId,
              userIds: [replyId.uid],
              from: user.uid,
              created_at: time,
              type: notificationTypes.REPLIED_COMMENT,
            }),
          );
      }
    } catch (e) {
      console.warn(e);
      dispatch(CommentRequestFailure('Can not add this comment!'));
    }
  };
};

export const AddCommentSuccess = (postId, data) => {
  return {
    type: commnetActionTypes.ADD_COMMENT_SUCCESS,
    payload: {postId, data},
  };
};

export const ReplyCommentSuccess = (postId, commentId, data) => {
  return {
    type: commnetActionTypes.ADD_REPLY_SUCCESS,
    payload: {postId, commentId, data},
  };
};

export const DeleteCommentRequest = (
  postId,
  commentId,
  replyId,
  created_at,
) => {
  return async (dispatch) => {
    try {
      const user = store.getState().user.userInfo;
      if (typeof replyId === 'undefined') {
        let replies = await firestore()
          .collection('comments')
          .where('commentId', '==', commentId)
          .get();
        Promise.all(
          replies.docs.map(async (doc) => {
            let data = doc.data();
            await firestore().collection('comments').doc(doc.id).delete();
            dispatch(
              DeleteNotificationRequest({
                postId,
                uid: data.uid,
                type: notificationTypes.REPLIED_COMMENT,
                created_at: data.created_at,
              }),
            );
            dispatch(
              DeleteNotificationRequest({
                postId,
                uid: data.uid,
                type: notificationTypes.COMMENT_MY_POST,
                created_at: data.created_at,
              }),
            );
            return;
          }),
        );
        await firestore().collection('comments').doc(commentId).delete();
        dispatch(
          DeleteNotificationRequest({
            postId,
            uid: user.uid,
            type: notificationTypes.COMMENT_MY_POST,
            created_at,
          }),
        );
        dispatch(DeleteCommentSuccess(postId, commentId));
      } else {
        await firestore().collection('comments').doc(replyId).delete();
        await firestore()
          .collection('comments')
          .doc(`${commentId}`)
          .update({replies: FieldValue.arrayRemove(replyId)});
        dispatch(
          DeleteNotificationRequest({
            postId,
            uid: user.uid,
            type: notificationTypes.COMMENT_MY_POST,
            created_at,
          }),
        );
        dispatch(
          DeleteNotificationRequest({
            postId,
            uid: user.uid,
            type: notificationTypes.REPLIED_COMMENT,
            created_at,
          }),
        );
        dispatch(DeleteReplySuccess(postId, commentId, replyId));
      }
    } catch (e) {
      console.warn(e);
      dispatch(CommentRequestFailure('Can not delete comment.'));
    }
  };
};

export const DeleteCommentSuccess = (postId, commentId) => {
  return {
    type: commnetActionTypes.DELETE_COMMENT_SUCCESS,
    payload: {postId, commentId},
  };
};

export const DeleteReplySuccess = (postId, commentId, replyId) => {
  return {
    type: commnetActionTypes.DELETE_REPLY_SUCCESS,
    payload: {postId, commentId, replyId},
  };
};
