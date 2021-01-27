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
import {UpdateExtraInfoRequest} from '../actions/userActions';
import {CreateNotificationRequest} from '../actions/notificationActions';
import * as ImageManipulator from 'expo-image-manipulator';

export const FetchPostListRequest = () => {
  return async (dispatch) => {
    try {
      let currentUser = {...store.getState().user.userInfo};
      const posts = await firestore()
        .collection('posts')
        .orderBy('created_at', 'desc')
        .limit(LIMIT_POSTS_PER_LOADING)
        .get();
      const payload = [];
      await Promise.all(
        posts.docs.map(async (doc) => {
          let comments = await doc.ref
            .collection('comments')
            .orderBy('create_at', 'desc')
            .get();
          comments = comments.docs.map((comment) => comment.data());
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
            comments: comments,
            initials: userData.initials,
            name: userData.name,
            isfollowed: currentUser.following.indexOf(postData.uid) >= 0,
            isSelf: currentUser.uid == postData.uid,
          });
        }),
      );
      dispatch(FetchPostListSuccess(payload));
    } catch (e) {
      dispatch(FetchPostListFailure());
    }
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
          let comments = await doc.ref
            .collection('comments')
            .orderBy('create_at', 'desc')
            .get();
          comments = comments.docs.map((comment) => comment.data());
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
            comments: comments,
            initials: userData.initials,
            name: userData.name,
            isfollowed: currentUser.following.indexOf(postData.uid) >= 0,
          });
        }),
      );
      if (payload.length == 0) dispatch(AllLoadedSuccess());
      else dispatch(LoadMorePostListSuccess(payload));
    } catch (e) {
      console.log(e);
      dispatch(LoadMorePostListFailure());
    }
  };
};

export const AllLoadedSuccess = () => {
  return {
    type: postActionTypes.ALL_LOADED_SUCCESS,
  };
};

export const CreatePostRequest = ({image, text}) => {
  return async (dispatch) => {
    try {
      let currentUser = {...store.getState().user.userInfo};
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
          dispatch(UpdateExtraInfoRequest(ref.id));
        });
      dispatch(FetchPostDataRequest());
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
