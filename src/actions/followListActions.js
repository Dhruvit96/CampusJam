import firestore from '@react-native-firebase/firestore';
import {followListActionTypes} from '../constants';
import {store} from '../store';

export const FetchFollowersRequest = (uid) => {
  return async (dispatch) => {
    try {
    } catch (e) {
      console.warn(e);
      dispatch(
        FollowListRequestFailure(
          'Something went wrong with notification try later.',
        ),
      );
    }
  };
};

export const FetchFollowersSuccess = (uid, data) => {
  return {
    type: profileXActionTypes.FETCH_USER_X_SUCCESS,
    payload: {
      uid,
      data,
    },
  };
};

export const FollowListRequestFailure = (message) => {
  return {
    type: followListActionTypes.FOLLOW_LIST_FAILURE,
    payload: {
      message,
    },
  };
};
