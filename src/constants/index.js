import firebase from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';

export const userActionTypes = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  LOGOUT_FAILURE: 'LOGOUT_FAILURE',
  REGISTER_REQUEST: 'REGISTER_REQUEST',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  FETCH_EXTRA_INFO_REQUEST: 'FETCH_EXTRA_INFO_REQUEST',
  FETCH_EXTRA_INFO_SUCCESS: 'FETCH_EXTRA_INFO_SUCCESS',
  FETCH_EXTRA_INFO_FAILURE: 'FETCH_EXTRA_INFO_FAILURE',
  UPDATE_EXTRA_INFO_SUCCESS: 'UPDATE_EXTRA_INFO_SUCCESS',
  UPDATE_USER_INFO_REQUEST: 'UPDATE_USER_INFO_REQUEST',
  UPDATE_USER_INFO_SUCCESS: 'UPDATE_USER_INFO_SUCCESS',
  UPDATE_USER_INFO_FAILURE: 'UPDATE_USER_INFO_FAILURE',
  UNFOLLOW_REQUEST: 'UNFOLLOW_REQUEST',
  UNFOLLOW_SUCCESS: 'UNFOLLOW_SUCCESS',
  UNFOLLOW_FAILURE: 'UNFOLLOW_FAILURE',
  FOLLOW_REQUEST: 'FOLLOW_REQUEST',
  FOLLOW_SUCCESS: 'FOLLOW_SUCCESS',
  FOLLOW_FAILURE: 'FOLLOW_FAILURE',
  UPDATE_NOTIFICATION_SETTING_REQUEST: 'UPDATE_NOTIFICATION_SETTING_REQUEST',
  UPDATE_NOTIFICATION_SETTING_SUCCESS: 'UPDATE_NOTIFICATION_SETTING_SUCCESS',
  UPDATE_NOTIFICATION_SETTING_FAILURE: 'UPDATE_NOTIFICATION_SETTING_FAILURE',
};

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
  FETCH_NOTIFICATIONS_REQUEST: 'FETCH_NOTIFICATIONS_REQUEST',
  FETCH_NOTIFICATIONS_SUCCESS: 'FETCH_NOTIFICATIONS_SUCCESS',
  FETCH_NOTIFICATIONS_FAILURE: 'FETCH_NOTIFICATIONS_FAILURE',
};

//export const FieldValue = firebase.firestore.FieldValue;
//export const TimeStamp = firebase.firestore.Timestamp;

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
