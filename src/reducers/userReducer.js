import {userActionTypes} from '../constants';
import {Alert} from 'react-native';
const defaultState = {
  logined: false,
  userInfo: {
    avatar: null,
    bio: '',
    email: email,
    followers: [],
    following: [],
    id: null,
    initials: '',
    isStudent: false,
    name: '',
    posts: [],
    uid: '',
    notificationSettings: {
      posts: true,
      comments: true,
      likes: true,
      followed: true,
      pauseAll: false,
    },
  },
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case userActionTypes.LOGIN_REQUEST:
    case userActionTypes.REGISTER_REQUEST:
    case userActionTypes.LOGOUT_SUCCESS:
      state = [...defaultState];
      return state;
    case userActionTypes.LOGIN_SUCCESS:
      state = {...state, ...action.payload};
      return state;
    case userActionTypes.LOGIN_FAILURE:
    case userActionTypes.FOLLOW_FAILURE:
    case userActionTypes.REGISTER_FAILURE:
    case userActionTypes.FETCH_EXTRA_INFO_FAILURE:
    case userActionTypes.UPDATE_USER_INFO_FAILURE:
    case userActionTypes.UPDATE_NOTIFICATION_SETTING_FAILURE:
    case userActionTypes.UNFOLLOW_FAILURE:
    case userActionTypes.LOGOUT_FAILURE:
      Alert.alert('Error', action.payload.message);
      return state;
    case userActionTypes.REGISTER_SUCCESS:
      message = action.payload.message;
      Alert.alert('Verify Email', message);
      return state;
    case userActionTypes.FETCH_EXTRA_INFO_REQUEST:
    case userActionTypes.UPDATE_USER_INFO_REQUEST:
    case userActionTypes.UPDATE_NOTIFICATION_SETTING_REQUEST:
    case userActionTypes.UNFOLLOW_REQUEST:
    case userActionTypes.FOLLOW_REQUEST:
      state = {...state};
      return state;
    case userActionTypes.UPDATE_EXTRA_INFO_SUCCESS:
    case userActionTypes.FETCH_EXTRA_INFO_SUCCESS:
      state = {
        ...state,
        userInfo: {...state.userInfo, ...action.payload.extraInfo},
      };
      return state;
    case userActionTypes.UPDATE_USER_INFO_SUCCESS:
      state = {
        ...state,
        userInfo: {
          ...state.userInfo,
          ...action.payload,
        },
      };
      return state;
    case userActionTypes.UPDATE_NOTIFICATION_SETTING_SUCCESS:
      state = {
        ...state,
        userInfo: {
          ...state.userInfo,
          notificationSettings: {
            ...state.userInfo?.notificationSettings,
            ...action.payload,
          },
        },
      };
      return state;
    case userActionTypes.UNFOLLOW_SUCCESS:
      state = {
        ...state,
        userInfo: {
          ...state.userInfo,
          followings: state.userInfo.following.filter(
            (x) => x !== action.payload,
          ),
        },
      };
      return state;
    case userActionTypes.FOLLOW_SUCCESS:
      state = {
        ...state,
        userInfo: {
          ...state.userInfo,
          followings: state.userInfo.following.push(action.payload),
        },
      };
      return state;
    default:
      return state;
  }
};
export default reducer;
