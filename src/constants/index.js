import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {Dimensions, PixelRatio} from 'react-native';

export const userActionTypes = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  LOGOUT_FAILURE: 'LOGOUT_FAILURE',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  PASSWORD_RESET_SUCCESS: 'PASSWORD_RESET_SUCCESS',
  PASSWORD_RESET_FAILURE: 'PASSWORD_RESET_FAILURE',
  FETCH_EXTRA_INFO_SUCCESS: 'FETCH_EXTRA_INFO_SUCCESS',
  FETCH_EXTRA_INFO_FAILURE: 'FETCH_EXTRA_INFO_FAILURE',
  UPDATE_EXTRA_INFO_SUCCESS: 'UPDATE_EXTRA_INFO_SUCCESS',
  UPDATE_USER_INFO_SUCCESS: 'UPDATE_USER_INFO_SUCCESS',
  UPDATE_USER_INFO_FAILURE: 'UPDATE_USER_INFO_FAILURE',
  UNFOLLOW_SUCCESS: 'UNFOLLOW_SUCCESS',
  UNFOLLOW_FAILURE: 'UNFOLLOW_FAILURE',
  FOLLOW_SUCCESS: 'FOLLOW_SUCCESS',
  FOLLOW_FAILURE: 'FOLLOW_FAILURE',
  UPDATE_NOTIFICATION_SETTING_SUCCESS: 'UPDATE_NOTIFICATION_SETTING_SUCCESS',
  UPDATE_NOTIFICATION_SETTING_FAILURE: 'UPDATE_NOTIFICATION_SETTING_FAILURE',
};

export const userXActionTypes = {
  FETCH_PROFILEX_SUCCESS: 'FETCH_PROFILEX_SUCCESS',
  FETCH_PROFILEX_FAILURE: 'FETCH_PROFILEX_FAILURE',
  LOAD_MORE_POST_LIST_X_SUCCESS: 'LOAD_MORE_POST_LIST_X_SUCCESS',
  LOAD_MORE_POST_LIST_X_FAILURE: 'LOAD_MORE_POST_LIST_X_FAILURE',
  TOGGLE_ALL_LOADED_SUCCESS: 'TOGGLE_ALL_LOADED_SUCCESS',
  TOGGLE_LIKE_POST_SUCCESS: 'TOGGLE_LIKE_POST_SUCCESS',
  TOGGLE_LIKE_POST_FAILURE: 'TOGGLE_LIKE_POST_FAILURE',
  TOGGLE_FOLLOW_USER_SUCCESS: 'TOGGLE_FOLLOW_USER_SUCCESS',
  TOGGLE_FOLLOW_USER_FAILURE: 'TOGGLE_FOLLOW_USER_FAILURE',
};

export const postActionTypes = {
  CREATE_POST_FAILURE: 'CREATE_POST_FAILURE',
  FETCH_POST_LIST_SUCCESS: 'FETCH_POST_LIST_SUCCESS',
  FETCH_POST_LIST_FAILURE: 'FETCH_POST_LIST_FAILURE',
  LOAD_MORE_POST_LIST_SUCCESS: 'LOAD_MORE_POST_LIST_SUCCESS',
  LOAD_MORE_POST_LIST_FAILURE: 'LOAD_MORE_POST_LIST_FAILURE',
  COMMENT_POST_SUCCESS: 'COMMENT_POST_SUCCESS',
  COMMENT_POST_FAILURE: 'COMMENT_POST_FAILURE',
  TOGGLE_ALL_LOADED_SUCCESS: 'TOGGLE_ALL_LOADED_SUCCESS',
  TOGGLE_LIKE_POST_SUCCESS: 'TOGGLE_LIKE_POST_SUCCESS',
  TOGGLE_LIKE_POST_FAILURE: 'TOGGLE_LIKE_POST_FAILURE',
  TOGGLE_FOLLOW_USER_SUCCESS: 'TOGGLE_FOLLOW_USER_SUCCESS',
  TOGGLE_FOLLOW_USER_FAILURE: 'TOGGLE_FOLLOW_USER_FAILURE',
};

export const LIMIT_POSTS_PER_LOADING = 5;

export const notificationTypes = {
  LIKE_MY_POST: 1,
  COMMENT_MY_POST: 2,
  FOLLOWED_ME: 3,
  SOMEONE_POSTS: 4,
};

export const seenTypes = {
  NOTSEEN: 0,
  SEEN: 1,
};

export const notificationActionTypes = {
  CREATE_NOTIFICATION_FAILURE: 'CREATE_NOTIFICATION_FAILURE',
  FETCH_NOTIFICATIONS_SUCCESS: 'FETCH_NOTIFICATIONS_SUCCESS',
  FETCH_NOTIFICATIONS_FAILURE: 'FETCH_NOTIFICATIONS_FAILURE',
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
