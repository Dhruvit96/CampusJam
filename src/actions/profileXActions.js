import {firestore} from '@react-native-firebase/firestore';
import {store} from '../store';
import {userXActionTypes} from '../constants';

export const FetchProfileXRequest = (uid) => {
  return async (dispatch) => {
    try {
      let user = await firestore().collection('users').doc(uid).get();
      user = user.data();
      let postData = await firestore()
        .collection('posts')
        .where('userId', '==', currentUser.uid)
        .orderBy('create_at', 'desc')
        .get();

      let followersData = await firestore()
        .collection('users')
        .where('followings', 'array-contains', currentUser.uid)
        .get();
      let followers = [];

      followersData.forEach((ref) => followers.push(ref.id));
      const data = {
        uid: {
          userInfo: {
            ...user,
            isStudent: typeof user.id === 'string',
          },
          extraInfo: {
            posts: postData.docs.map((x) => x.data()),
            followers: followers,
          },
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
