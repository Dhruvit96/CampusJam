import firestore from '@react-native-firebase/firestore';
import {profileXActionTypes} from '../constants';
import {store} from '../store';
import {AddPostsRequest} from './postActions';

export const FetchProfileXRequest = (uid) => {
  return async (dispatch) => {
    try {
      const currentUser = {...store.getState().user.userInfo};
      let user = await firestore().collection('users').doc(uid).get();
      user = user.data();
      let postsData;
      let posts = [];
      let postIds = [];
      let likedPosts = [];
      let likedPostIds = [];
      let followers = [];
      if (typeof user.id === 'object') {
        postsData = await firestore()
          .collection('posts')
          .where('likedBy', 'array-contains', uid)
          .get();
        await Promise.all(
          postsData.docs.map(async (doc) => {
            let postData = doc.data();
            likedPostIds.push(doc.id);
            let userData = await firestore()
              .collection('users')
              .doc(postData.uid)
              .get();
            return likedPosts.push({
              ...postData,
              avatar: userData.data().avatar,
              postId: doc.id,
              initials: userData.data().initials,
              name: userData.data().name,
              isSelf: postData.uid === currentUser.uid,
              isLiked: postData.likedBy.indexOf(currentUser.uid) >= 0,
            });
          }),
        );
      } else {
        postsData = await firestore()
          .collection('posts')
          .where('uid', '==', uid)
          .orderBy('created_at', 'desc')
          .get();

        await Promise.all(
          postsData.docs.map(async (doc) => {
            let postData = doc.data();
            postIds.push(doc.id);
            return posts.push({
              ...postData,
              avatar: user.avatar,
              postId: doc.id,
              initials: user.initials,
              name: user.name,
              isSelf: postData.uid === currentUser.uid,
              isLiked: postData.likedBy.indexOf(currentUser.uid) >= 0,
            });
          }),
        );
        let followersData = await firestore()
          .collection('users')
          .where('followings', 'array-contains', uid)
          .get();
        followersData.forEach((ref) => followers.push(ref.id));
      }
      let data = {
        ...user,
        isStudent: typeof user.id === 'string',
        posts: postIds,
        likedPosts: likedPostIds,
        followers: followers,
        isFollowed: currentUser.followings.indexOf(uid) > -1,
      };
      dispatch(AddPostsRequest([...likedPosts, ...posts]));
      dispatch(FetchProfileXSuccess(uid, data));
    } catch (e) {
      console.warn(e);
      dispatch(
        FetchProfileXFailure(
          'Something went wrong with notification try later.',
        ),
      );
    }
  };
};

export const FetchProfileXSuccess = (uid, data) => {
  return {
    type: profileXActionTypes.FETCH_USER_X_SUCCESS,
    payload: {
      uid,
      data,
    },
  };
};

export const FetchProfileXFailure = (message) => {
  return {
    type: profileXActionTypes.FETCH_USER_X_FAILURE,
    payload: {
      message,
    },
  };
};

export const followXSuccess = (uid, currentUid) => {
  return {
    type: profileXActionTypes.FOLLOW_SUCCESS,
    payload: {uid, currentUid},
  };
};

export const unfollowXSuccess = (uid, currentUid) => {
  return {
    type: profileXActionTypes.UNFOLLOW_SUCCESS,
    payload: {uid, currentUid},
  };
};

export const DecreaseLikedPost = (postId, uid) => {
  return {
    type: profileXActionTypes.DECREASE_LIKED_POST,
    payload: {postId, uid},
  };
};

export const UpdateLikedPostsX = (uid) => {
  return async (dispatch) => {
    try {
      let likedPosts = {...store.getState().profile[uid].likedPosts};
      likedPosts.map((postId) => {
        if (typeof store.getState().post[postId] == 'undefined')
          dispatch(DecreaseLikedPost(postId, uid));
      });
    } catch (e) {
      console.warn(e);
      dispatch(FetchProfileXFailure('Something went wrong.'));
    }
  };
};
