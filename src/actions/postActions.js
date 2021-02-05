import {
  LIMIT_POSTS_PER_LOADING,
  postActionTypes,
  notificationTypes,
  seenTypes,
  uploadPhotoAsync,
  FieldValue,
} from '../constants';
import firestore from '@react-native-firebase/firestore';
import {store} from '../store';
import {
  followRequest,
  UnfollowRequest,
  UpdateExtraInfoRequest,
} from '../actions/userActions';
import {CreateNotificationRequest} from '../actions/notificationActions';
import * as ImageManipulator from 'expo-image-manipulator';

export const FetchPostListRequest = () => {
  return async (dispatch) => {
    try {
      dispatch(ToggleAllLoadedSuccess(false));
      let currentUser = {...store.getState().user.userInfo};
      const posts = await firestore()
        .collection('posts')
        .orderBy('created_at', 'desc')
        .limit(LIMIT_POSTS_PER_LOADING)
        .get();
      const payload = [];
      await Promise.all(
        posts.docs.map(async (doc) => {
          let postData = doc.data();
          let userData = await firestore()
            .collection('users')
            .doc(postData.uid)
            .get();
          userData = userData.data();
          return payload.push({
            ...postData,
            avatar: userData.avatar,
            postId: doc.id,
            initials: userData.initials,
            name: userData.name,
            isSelf: currentUser.uid == postData.uid,
            isLiked: postData.likedBy.indexOf(currentUser.uid) >= 0,
          });
        }),
      );
      dispatch(FetchPostListSuccess(payload));
    } catch (e) {
      console.log(e);
      dispatch(FetchPostListFailure());
    }
  };
};

export const FetchPostListFailure = () => {
  return {
    type: postActionTypes.FETCH_POST_LIST_FAILURE,
    payload: {
      message: 'Get Post List Failed!',
    },
  };
};

export const FetchPostListSuccess = (payload) => {
  return {
    type: postActionTypes.FETCH_POST_LIST_SUCCESS,
    payload: payload,
  };
};

export const LoadMorePostListRequest = () => {
  return async (dispatch) => {
    try {
      let currentUser = {...store.getState().user.userInfo};
      let starting = store.getState().post.posts[
        store.getState().post.posts.length - 1
      ].created_at;
      const posts = await firestore()
        .collection('posts')
        .orderBy('created_at', 'desc')
        .startAfter(starting)
        .limit(LIMIT_POSTS_PER_LOADING)
        .get();
      const payload = [];
      await Promise.all(
        posts.docs.map(async (doc) => {
          let postData = doc.data();
          let userData = await firestore()
            .collection('users')
            .doc(postData.uid)
            .get();
          userData = userData.data();
          return payload.push({
            ...postData,
            avatar: userData.avatar,
            postId: doc.id,
            initials: userData.initials,
            name: userData.name,
            isSelf: currentUser.uid == postData.uid,
            isLiked: postData.likedBy.indexOf(currentUser.uid) >= 0,
          });
        }),
      );
      if (payload.length < LIMIT_POSTS_PER_LOADING)
        dispatch(ToggleAllLoadedSuccess(true));
      dispatch(LoadMorePostListSuccess(payload));
    } catch (e) {
      console.log(e);
      dispatch(LoadMorePostListFailure());
    }
  };
};

export const LoadMorePostListFailure = () => {
  return {
    type: postActionTypes.LOAD_MORE_POST_LIST_FAILURE,
    payload: {
      message: 'Can not load more posts!',
    },
  };
};

export const LoadMorePostListSuccess = (payload) => {
  return {
    type: postActionTypes.LOAD_MORE_POST_LIST_SUCCESS,
    payload: payload,
  };
};

export const CreatePostRequest = ({image, text}) => {
  return async (dispatch) => {
    try {
      let currentUser = {...store.getState().user.userInfo};
      let followers = {...store.getState().user.extraInfo};
      let imageUri = await ImageManipulator.manipulateAsync(
        image,
        [{resize: {width: 580}}],
        {format: 'jpeg'},
      );
      let scale = imageUri.height / imageUri.width;
      let time = Date.now();
      let uploadedImageUri = await uploadPhotoAsync(
        imageUri.uri,
        `photos/${currentUser.uid}/${time}`,
      );
      let data = {
        image: uploadedImageUri,
        scale: scale,
        text: text,
        created_at: time,
        uid: currentUser.uid,
        likedBy: [],
      };
      await firestore()
        .collection('posts')
        .add({...data})
        .then(async (ref) => {
          await firestore()
            .collection('user')
            .doc(currentUser.uid)
            .update({
              posts: FieldValue.arrayUnion(ref.id),
            });
          dispatch(
            CreateNotificationRequest({
              postId: ref.id,
              userIds: [...followers],
              from: currentUser.uid,
              created_at: Date.now(),
              seen: seenTypes.NOTSEEN,
              type: notificationTypes.SOMEONE_POSTS,
            }),
          );
          dispatch(UpdateExtraInfoRequest(ref.id));
        });

      dispatch(FetchPostListRequest());
    } catch (e) {
      dispatch(CreatePostFailure());
    }
  };
};

export const CreatePostFailure = () => {
  return {
    type: postActionTypes.CREATE_POST_FAILURE,
    payload: {
      message: 'Can not post this post!',
    },
  };
};

export const ToggleLikePostRequest = (postUserId, postId, isLiked) => {
  return async (dispatch) => {
    try {
      let uid = store.getState().user.userInfo.uid;
      if (isLiked)
        await firestore()
          .collection('posts')
          .doc(postId)
          .update({likedBy: FieldValue.arrayRemove(uid)});
      else {
        await firestore()
          .collection('posts')
          .doc(postId)
          .update({
            likedBy: FieldValue.arrayUnion(uid),
          });
        if (postUserId != uid) {
          dispatch(
            CreateNotificationRequest({
              postId: postId,
              userIds: [postUserId],
              from: uid,
              created_at: Date.now(),
              seen: seenTypes.NOTSEEN,
              type: notificationTypes.LIKE_MY_POST,
            }),
          );
        }
      }
    } catch (e) {
      console.log(e);
      dispatch(ToggleLikePostFailure());
    }
  };
};

export const ToggleLikePostFailure = () => {
  return {
    type: postActionTypes.TOGGLE_LIKE_POST_FAILURE,
    payload: {
      message: 'Can not like this posts!',
    },
  };
};

export const ToggleFollowUserRequest = (uid, isFollowed) => {
  return async (dispatch) => {
    try {
      if (isFollowed) dispatch(UnfollowRequest(uid));
      else dispatch(followRequest(uid));
    } catch (e) {
      console.log(e);
      dispatch(ToggleFollowUserFailure());
    }
  };
};

export const ToggleFollowUserFailure = () => {
  return {
    type: postActionTypes.TOGGLE_FOLLOW_USER_FAILURE,
    payload: {
      message: 'Can not follow this user!',
    },
  };
};

export const ToggleAllLoadedSuccess = (value) => {
  return {
    type: postActionTypes.TOGGLE_ALL_LOADED_SUCCESS,
    payload: value,
  };
};
