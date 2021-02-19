import firestore from '@react-native-firebase/firestore';
import {profileXActionTypes} from '../constants';
import {store} from '../store';

export const FetchProfileXRequest = (uid) => {
  return async (dispatch) => {
    try {
      const currentUser = {...store.getState().user.userInfo};
      let user = await firestore().collection('users').doc(uid).get();
      user = user.data();
      let postsData;
      let posts = [];
      let likedPosts = [];
      let followers = [];
      if (typeof user.id === 'undefined') {
        let posts = await firestore()
          .collection('posts')
          .where('likedBy', 'array-contains', uid)
          .get();
        await Promise.all(
          posts.docs.map(async (doc) => {
            let postData = doc.data();
            return likedPosts.push({
              ...postData,
              avatar: user.avatar,
              postId: doc.id,
              initials: user.initials,
              name: user.name,
              isSelf: true,
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
            return posts.push({
              ...postData,
              avatar: user.avatar,
              postId: doc.id,
              initials: user.initials,
              name: user.name,
              isSelf: true,
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
        posts: posts,
        likedPosts: likedPosts,
        followers: followers,
        isFollowed: currentUser.followings.indexOf(uid) > -1,
      };
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

export const followXSuccess = (uid) => {
  return {
    type: profileXActionTypes.FOLLOW_SUCCESS,
    payload: {uid},
  };
};

export const unfollowXSuccess = (uid) => {
  return {
    type: profileXActionTypes.UNFOLLOW_SUCCESS,
    payload: {uid},
  };
};
