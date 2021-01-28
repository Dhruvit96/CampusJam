import {userActionTypes} from '../constants';
import {Alert} from 'react-native';
const defaultState = {
  logined: false,
  userInfo: {
    avatar: null,
    bio: '',
    email: '',
    followings: [],
    id: null,
    initials: '',
    isStudent: false,
    name: '',
    uid: '',
    notificationSettings: {
      posts: true,
      comments: true,
      likes: true,
      followed: true,
      pauseAll: false,
    },
  },
  extraInfo: {
    followers: [],
    posts: [],
  },
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case userActionTypes.LOGOUT_SUCCESS:
      state = [...defaultState];
      return state;
    case userActionTypes.LOGIN_SUCCESS:
      state = {
        ...state,
        ...action.payload,
        userInfo: {...action.payload.userInfo},
      };
      console.log(state);
      return state;
    case userActionTypes.LOGIN_FAILURE:
    case userActionTypes.FOLLOW_FAILURE:
    case userActionTypes.REGISTER_FAILURE:
    case userActionTypes.FETCH_EXTRA_INFO_FAILURE:
    case userActionTypes.UPDATE_USER_INFO_FAILURE:
    case userActionTypes.UPDATE_NOTIFICATION_SETTING_FAILURE:
    case userActionTypes.UNFOLLOW_FAILURE:
    case userActionTypes.LOGOUT_FAILURE:
    case userActionTypes.PASSWORD_RESET_FAILURE:
      Alert.alert('Error', action.payload.message);
      return state;
    case userActionTypes.REGISTER_SUCCESS:
      Alert.alert('Verify Email', action.payload.message);
      return state;
    case userActionTypes.PASSWORD_RESET_SUCCESS:
      Alert.alert('Password reset', action.payload.message);
      return state;
    case userActionTypes.FETCH_EXTRA_INFO_SUCCESS:
      state = {
        ...state,
        userInfo: {...state.userInfo, ...action.payload.userInfo},
        extraInfo: {...state.extraInfo, ...action.payload.extraInfo},
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
    case userActionTypes.UPDATE_EXTRA_INFO_SUCCESS:
      state = {
        ...state,
        exraInfo: {
          ...state.exraInfo,
          posts: [action.payload.postId, ...state.extraInfo.posts],
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
          followings: state.userInfo.followings.filter(
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
          followings: [action.payload, ...state.userInfo.followings],
        },
      };
      return state;
    default:
      return state;
  }
};
export default reducer;
