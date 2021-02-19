import {Dimensions, PixelRatio} from 'react-native';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export const userActionTypes = {
  DECREASE_LIKED_POST_COUNT: 'DECREASE_LIKED_POST_COUNT',
  DELETE_POST_SUCCESS: 'DELETE_POST_SUCCESS',
  FETCH_EXTRA_INFO_SUCCESS: 'FETCH_EXTRA_INFO_SUCCESS',
  FOLLOW_SUCCESS: 'FOLLOW_SUCCESS',
  INCREASE_LIKED_POST_COUNT: 'INCREASE_LIKED_POST_COUNT',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  PASSWORD_RESET_SUCCESS: 'PASSWORD_RESET_SUCCESS',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  UNFOLLOW_SUCCESS: 'UNFOLLOW_SUCCESS',
  UPDATE_EXTRA_INFO_SUCCESS: 'UPDATE_EXTRA_INFO_SUCCESS',
  UPDATE_SHARED_POST_SUCCESS: 'UPDATE_SHARED_POST_SUCCESS',
  UPDATE_USER_INFO_SUCCESS: 'UPDATE_USER_INFO_SUCCESS',
  USER_REQUEST_FAILURE: 'USER_REQUEST_FAILURE',
  TOGGLE_LOADING: 'TOGGLE_LOADING',
};

export const profileXActionTypes = {
  FETCH_USER_X_SUCCESS: 'FETCH_USER_X_SUCCESS',
  FETCH_USER_X_FAILURE: 'FETCH_USER_X_FAILURE',
  FOLLOW_SUCCESS: 'FOLLOW_SUCCESS',
  UNFOLLOW_SUCCESS: 'UNFOLLOW_SUCCESS',
};

export const postActionTypes = {
  CREATE_POST_SUCCESS: 'CREATE_POST_SUCCESS',
  DELETE_POST_SUCCESS: 'DELETE_POST_SUCCESS',
  FETCH_POST_LIST_SUCCESS: 'FETCH_POST_LIST_SUCCESS',
  LOAD_MORE_POST_LIST_SUCCESS: 'LOAD_MORE_POST_LIST_SUCCESS',
  POST_REQUEST_FAILURE: 'POST_REQUEST_FAILURE',
  UPDATE_POST_SUCCESS: 'UPDATE_POST_SUCCESS',
  TOGGLE_ALL_LOADED_SUCCESS: 'TOGGLE_ALL_LOADED_SUCCESS',
};

export const commnetActionTypes = {
  ADD_COMMENT_SUCCESS: 'ADD_COMMENT_SUCCESS',
  ADD_REPLY_SUCCESS: 'ADD_REPLY_SUCCESS',
  COMMENT_REQUEST_FAILURE: 'COMMENT_REQUEST_FAILURE',
  DELETE_COMMENT_SUCCESS: 'DELETE_COMMENT_SUCCESS',
  DELETE_REPLY_SUCCESS: 'DELETE_REPLY_SUCCESS',
  FETCH_COMMENT_LIST_SUCCESS: 'FETCH_COMMENT_LIST_SUCCESS',
};

export const followListActionTypes = {
  FETCH_FOLLOWERS_SUCCESS: 'FETCH_FOLLOWERS_SUCCESS',
  FETCH_FOLLOWING_SUCCESS: 'FETCH_FOLLOWERS_SUCCESS',
  FOLLOW_LIST_FAILURE: 'FOLLOW_LIST_FAILURE',
};

export const LIMIT_POSTS_PER_LOADING = 5;

export const notificationTypes = {
  LIKE_MY_POST: 1,
  COMMENT_MY_POST: 2,
  FOLLOWED_ME: 3,
  SOMEONE_POSTS: 4,
  REPLIED_COMMENT: 5,
};

export const notificationActionTypes = {
  FETCH_NOTIFICATIONS_SUCCESS: 'FETCH_NOTIFICATIONS_SUCCESS',
  NOTIFICATION_REQUEST_FAILURE: 'NOTIFICATION_REQUEST_FAILURE',
};

export const FieldValue = firebase.firestore.FieldValue;

export const uploadPhotoAsync = (uri, filename) => {
  return new Promise(async (res, rej) => {
    const response = await fetch(uri);
    const file = await response.blob();
    storage()
      .ref(filename)
      .put(file)
      .on(
        'state_changed',
        () => {},
        (err) => {
          rej(err);
        },
        async (snapshot) => {
          let url = await snapshot.ref.getDownloadURL();
          res(url);
        },
      );
  });
};

// Retrieve initial screen's width
let screenWidth = Dimensions.get('window').width;

// Retrieve initial screen's height
let screenHeight = Dimensions.get('window').height;

/**
 * Converts provided width percentage to independent pixel (dp).
 * @param  {string} widthPercent The percentage of screen's width that UI element should cover
 *                               along with the percentage symbol (%).
 * @return {number}              The calculated dp depending on current device's screen width.
 */
export const widthPercentageToDP = (widthPercent) => {
  // Parse string percentage input and convert it to number.
  const elemWidth =
    typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);

  // Use PixelRatio.roundToNearestPixel method in order to round the layout
  // size (dp) to the nearest one that correspons to an integer number of pixels.
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

/**
 * Converts provided height percentage to independent pixel (dp).
 * @param  {string} heightPercent The percentage of screen's height that UI element should cover
 *                                along with the percentage symbol (%).
 * @return {number}               The calculated dp depending on current device's screen height.
 */
export const heightPercentageToDP = (heightPercent) => {
  // Parse string percentage input and convert it to number.
  const elemHeight =
    typeof heightPercent === 'number'
      ? heightPercent
      : parseFloat(heightPercent);

  // Use PixelRatio.roundToNearestPixel method in order to round the layout
  // size (dp) to the nearest one that correspons to an integer number of pixels.
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

export const fontscale = (size) => {
  return (screenWidth / 375) * size;
};

export const findWithAttr = (array, attr, value) => {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][attr] === value) {
      return i;
    }
  }
  return -1;
};
