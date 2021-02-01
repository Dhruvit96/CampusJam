import {firestore} from '@react-native-firebase/firestore';
import {store} from '../store';
import {LIMIT_POSTS_PER_LOADING, userXActionTypes} from '../constants';
import {ToggleFollowUserRequest, ToggleLikePostRequest} from './postActions';

export const FetchProfileXRequest = (uid) => {
  return async (dispatch) => {
    try {
      dispatch(ToggleAllLoadedSuccess({uid: uid, value: false}));
      let currentUser = {...store.getState().user.userInfo};
      let user = await firestore().collection('users').doc(uid).get();
      user = user.data();
      let postsData = await firestore()
        .collection('posts')
        .where('userId', '==', uid)
        .orderBy('created_at', 'desc')
        .limit(LIMIT_POSTS_PER_LOADING)
        .get();
      let posts = [];
      await Promise.all(
        postsData.docs.map(async (doc) => {
          let postData = doc.data();
          return posts.push({
            ...postData,
            avatar: user.avatar,
            postId: doc.id,
            comments: comments,
            initials: user.initials,
            name: user.name,
            isLiked: postData.likedBy.indexOf(currentUser.uid) >= 0,
            isFollowed: currentUser.followings.indexOf(postData.uid) >= 0,
          });
        }),
      );

      let followersData = await firestore()
        .collection('users')
        .where('followings', 'array-contains', currentUser.uid)
        .get();
      let followers = [];

      followersData.forEach((ref) => followers.push(ref.id));
      const data = {
        userInfo: {
          ...user,
          uid: uid,
          isStudent: typeof user.id === 'string',
        },
        extraInfo: {
          allLoaded: false,
          followers: followers,
          posts: posts.docs.map((x) => x.data()),
        },
      };
      dispatch(FetchProfileXSuccess(data));
    } catch (e) {
      console.warn(e);
      dispatch(FetchProfileXFailure());
    }
  };
};

export const FetchProfileXFailure = () => {
  return {
    type: userXActionTypes.FETCH_PROFILEX_FAILURE,
    payload: {
      message: "This profile doesn't exists",
    },
  };
};

export const FetchProfileXSuccess = (payload) => {
  return {
    type: userXActionTypes.FETCH_PROFILEX_SUCCESS,
    payload: payload,
  };
};

export const LoadMorePostListXRequest = (uid) => {
  return async (dispatch) => {
    try {
      let starting = store.getState().profile[uid].extraInfo.posts[
        store.getState().profile[uid].extraInfo.posts.length - 1
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
            isLiked: postData.likedBy.indexOf(currentUser.uid) >= 0,
            isFollowed: currentUser.followings.indexOf(postData.uid) >= 0,
          });
        }),
      );
      if (payload.length < LIMIT_POSTS_PER_LOADING)
        dispatch(ToggleAllLoadedSuccess({uid: uid, value: true}));
      else dispatch(LoadMorePostListXSuccess({uid: uid, posts: payload}));
    } catch (e) {
      console.log(e);
      dispatch(LoadMorePostListXFailure());
    }
  };
};

export const LoadMorePostListXFailure = () => {
  return {
    type: userXActionTypes.LOAD_MORE_POST_LIST_X_FAILURE,
    payload: {
      message: 'Can not load more posts!',
    },
  };
};

export const LoadMorePostListXSuccess = (payload) => {
  return {
    type: userXActionTypes.LOAD_MORE_POST_LIST_X_SUCCESS,
    payload: payload,
  };
};
export const ToggleLikePostXRequest = (postUserId, postId, isLiked) => {
  return async (dispatch) => {
    try {
      dispatch(ToggleLikePostRequest(postUserId, postId, isLiked));
      dispatch(ToggleLikePostSuccess({postUserId, postId, uid}));
    } catch (e) {
      console.log(e);
      dispatch(ToggleLikePostFailure());
    }
  };
};

export const ToggleLikePostSuccess = (payload) => {
  return {
    type: userXActionTypes.TOGGLE_LIKE_POST_SUCCESS,
    payload: payload,
  };
};

export const ToggleLikePostFailure = () => {
  return {
    type: userXActionTypes.TOGGLE_LIKE_POST_FAILURE,
    payload: {
      message: 'Can not like this posts!',
    },
  };
};

export const ToggleFollowUserXRequest = (uid, isFollowed) => {
  return async (dispatch) => {
    try {
      dispatch(ToggleFollowUserRequest(uid, isFollowed));
      dispatch(ToggleFollowUserSuccess(uid));
    } catch (e) {
      console.log(e);
      dispatch(ToggleFollowUserFailure());
    }
  };
};

export const ToggleFollowUserSuccess = (uid) => {
  return {
    type: userXActionTypes.TOGGLE_FOLLOW_USER_SUCCESS,
    payload: uid,
  };
};

export const ToggleFollowUserFailure = () => {
  return {
    type: userXActionTypes.TOGGLE_FOLLOW_USER_FAILURE,
    payload: {
      message: 'Can not follow this user!',
    },
  };
};

export const ToggleAllLoadedSuccess = (value) => {
  return {
    type: userXActionTypes.TOGGLE_ALL_LOADED_SUCCESS,
    payload: value,
  };
};
