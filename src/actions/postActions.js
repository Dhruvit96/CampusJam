import {
  LIMIT_POSTS_PER_LOADING,
  postActionTypes,
  notificationTypes,
  uploadPhotoAsync,
  FieldValue,
} from '../constants';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {store} from '../store';
import {
  DeleteSharedPostSuccess,
  followRequest,
  IncreaseLikedPostCountRequest,
  ToggleLoading,
  UnfollowRequest,
  UpdateExtraInfoRequest,
} from '../actions/userActions';
import {
  CreateNotificationRequest,
  DeleteNotificationRequest,
} from '../actions/notificationActions';
import * as ImageManipulator from 'expo-image-manipulator';

export const PostRequestFailure = (message) => {
  return {
    type: postActionTypes.POST_REQUEST_FAILURE,
    payload: {
      message,
    },
  };
};

export const AddPostsRequest = (posts) => {
  return {
    type: postActionTypes.ADD_POSTS_SUCCESS,
    payload: {posts},
  };
};

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
      const postIds = [];
      const payload = [];
      await Promise.all(
        posts.docs.map(async (doc) => {
          let postData = doc.data();
          postIds.push(doc.id);
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
      dispatch(AddPostsRequest(payload));
      dispatch(FetchPostListSuccess(postIds));
    } catch (e) {
      console.warn(e);
      dispatch(PostRequestFailure('Get Post List Failed!'));
    }
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
      const postIds = [];
      const payload = [];
      await Promise.all(
        posts.docs.map(async (doc) => {
          let postData = doc.data();
          postIds.push(doc.id);
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
      dispatch(AddPostsRequest(payload));
      dispatch(FetchPostListSuccess(postIds));
    } catch (e) {
      console.warn(e);
      dispatch(PostRequestFailure('Can not load more posts!'));
    }
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
      await dispatch(ToggleLoading());
      let currentUser = {...store.getState().user.userInfo};
      let followers = [...store.getState().user.extraInfo.followers];
      let time = Date.now();
      let uploadedImageUri = null;
      let scale = 0;
      if (typeof image !== 'undefined') {
        let imageUri = await ImageManipulator.manipulateAsync(
          image,
          [{resize: {width: 580}}],
          {format: ImageManipulator.SaveFormat.PNG},
        );
        scale = imageUri.height / imageUri.width;
        uploadedImageUri = await uploadPhotoAsync(
          imageUri.uri,
          `photos/${currentUser.uid}/${time}`,
        );
      }
      let data = {
        image: uploadedImageUri,
        scale: scale,
        text: text?.trim(),
        created_at: time,
        uid: currentUser.uid,
        likedBy: [],
      };
      await firestore()
        .collection('posts')
        .add(data)
        .then(async (ref) => {
          dispatch(
            CreateNotificationRequest({
              postId: ref.id,
              userIds: [...followers],
              from: currentUser.uid,
              created_at: time,
              type: notificationTypes.SOMEONE_POSTS,
            }),
          );
          data = {
            ...data,
            avatar: currentUser.avatar,
            postId: ref.id,
            initials: currentUser.initials,
            name: currentUser.name,
            isSelf: true,
            isLiked: false,
          };
          dispatch(UpdateExtraInfoRequest(ref.id));
          dispatch(CreatePostSuccess(ref.id));
          dispatch(AddPostsRequest([data]));
        });
    } catch (e) {
      console.warn(e);
      dispatch(PostRequestFailure('Can not post this post!'));
    } finally {
      dispatch(ToggleLoading());
    }
  };
};

export const CreatePostSuccess = (postId) => {
  return {
    type: postActionTypes.CREATE_POST_SUCCESS,
    payload: postId,
  };
};

export const UpdatePostRequest = ({postId, image, text}) => {
  return async (dispatch) => {
    try {
      await dispatch(ToggleLoading());
      let post = store.getState().user.extraInfo.posts;
      post = post.filter((x) => x.postId === postId)[0];
      let scale = post.scale;
      let uploadedImageUri = post.image;
      let time = post.created_at;
      if (image !== post.image && typeof image == 'string') {
        let imageUri = await ImageManipulator.manipulateAsync(
          image,
          [{resize: {width: 580}}],
          {format: ImageManipulator.SaveFormat.PNG},
        );
        scale = imageUri.height / imageUri.width;
        uploadedImageUri = await uploadPhotoAsync(
          imageUri.uri,
          `photos/${post.uid}/${time}`,
        );
      } else if (image !== post.image && typeof image == 'undefined') {
        await storage().ref(`photos/${post.uid}/${post.created_at}`).delete();
        uploadedImageUri = undefined;
      }
      let data = {
        image: uploadedImageUri,
        text: text,
        scale: scale,
      };
      await firestore().collection('posts').doc(postId).update(data);
      dispatch(UpdatePostSuccess({data, postId}));
    } catch (e) {
      console.warn(e);
      dispatch(PostRequestFailure('Can not update this post!'));
    } finally {
      dispatch(ToggleLoading());
    }
  };
};

export const UpdatePostSuccess = (payload) => {
  return {
    type: postActionTypes.UPDATE_POST_SUCCESS,
    payload: payload,
  };
};

export const DeletePostRequest = (postId) => {
  return async (dispatch) => {
    try {
      let uid = store.getState().user.userInfo.uid;
      let postData = store.getState().user.extraInfo.posts;
      postData = postData.filter((x) => x.postId === postId)[0];
      if (typeof postData.image == 'string' && postData.image.length > 0) {
        await storage().ref(`photos/${uid}/${postData.created_at}`).delete();
      }
      let data = await firestore()
        .collection('comments')
        .where('postId', '==', postId)
        .get();
      await Promise.all(
        data.docs.map(async (doc) => {
          let replies = await firestore()
            .collection('comments')
            .where('commentId', '==', doc.id)
            .get();
          await Promise.all(
            replies.docs.map(async (id) => {
              await firestore().collection('comments').doc(`${id}`).delete();
              return 0;
            }),
          );
          await firestore().collection('comments').doc(`${doc.id}`).delete();
          return 0;
        }),
      );
      await firestore().collection('posts').doc(postId).delete();
      dispatch(
        DeleteNotificationRequest({
          postId: postId,
          uid: uid,
          type: notificationTypes.SOMEONE_POSTS,
          created_at: postData.created_at,
        }),
      );
      dispatch(DeleteSharedPostSuccess(postId));
      dispatch(DeletePostSuccess(postId));
    } catch (e) {
      console.warn(e);
      dispatch(PostRequestFailure('Can not delete post.'));
    }
  };
};

export const DeletePostSuccess = (postId) => {
  return {
    type: postActionTypes.DELETE_POST_SUCCESS,
    payload: postId,
  };
};

export const ToggleLikePostRequest = (postUserId, postId, isLiked) => {
  return async (dispatch) => {
    try {
      const uid = store.getState().user.userInfo.uid;
      if (isLiked) {
        await firestore()
          .collection('posts')
          .doc(postId)
          .update({likedBy: FieldValue.arrayRemove(uid)});
        dispatch(
          DeleteNotificationRequest({
            userIds: [postUserId],
            uid: uid,
            type: notificationTypes.LIKE_MY_POST,
          }),
        );
      } else {
        await firestore()
          .collection('posts')
          .doc(postId)
          .update({
            likedBy: FieldValue.arrayUnion(uid),
          });
        dispatch(IncreaseLikedPostCountRequest(postId));
        if (postUserId != uid) {
          dispatch(
            CreateNotificationRequest({
              postId: postId,
              userIds: [postUserId],
              from: uid,
              created_at: Date.now(),
              type: notificationTypes.LIKE_MY_POST,
            }),
          );
        }
      }
      dispatch(ToggleLikePostSuccess(postId, uid));
    } catch (e) {
      console.warn(e);
      dispatch(PostRequestFailure('Can not like this posts!'));
    }
  };
};

export const ToggleLikePostSuccess = (postId, uid) => {
  return {
    type: postActionTypes.TOGGLE_LIKE_SUCCESS,
    payload: {postId, uid},
  };
};

export const ToggleFollowUserRequest = (uid, isFollowed) => {
  return (dispatch) => {
    try {
      if (isFollowed) dispatch(UnfollowRequest(uid));
      else dispatch(followRequest(uid));
    } catch (e) {
      console.warn(e);
      dispatch(PostRequestFailure('Something went wrong try later'));
    }
  };
};

export const ToggleAllLoadedSuccess = (value) => {
  return {
    type: postActionTypes.TOGGLE_ALL_LOADED_SUCCESS,
    payload: value,
  };
};
