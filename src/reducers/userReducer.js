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
  },
  extraInfo: {
    followers: [],
    posts: [],
    likedPosts: [],
  },
  loading: false,
};

const reducer = (state = defaultState, action) => {
  let index = 0;
  switch (action.type) {
    case userActionTypes.DECREASE_LIKED_POST_COUNT:
      state.extraInfo.likedPosts = state.extraInfo.likedPosts.filter(
        (x) => x !== action.payload.postId,
      );
      return state;
    case userActionTypes.DELETE_POST_SUCCESS:
      state = {
        ...state,
        extraInfo: {
          ...state.extraInfo,
          posts: [
            ...state.extraInfo.posts.filter((x) => x !== action.payload.postId),
          ],
          likedPosts: [
            ...state.extraInfo.likedPosts.filter(
              (x) => x !== action.payload.postId,
            ),
          ],
        },
      };
      return state;
    case userActionTypes.FETCH_EXTRA_INFO_SUCCESS:
      state = {
        ...state,
        userInfo: {...state.userInfo, ...action.payload.userInfo},
        extraInfo: {...state.extraInfo, ...action.payload.extraInfo},
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
    case userActionTypes.INCREASE_LIKED_POST_COUNT:
      index = state.extraInfo.likedPosts.indexOf(action.payload.postId);
      if (index == -1)
        state = {
          ...state,
          extraInfo: {
            ...state.extraInfo,
            likedPosts: [action.payload.postId, ...state.extraInfo.likedPosts],
          },
        };
      return state;
    case userActionTypes.LOGIN_SUCCESS:
      state = {
        ...state,
        ...action.payload,
        userInfo: {...action.payload.userInfo},
      };
      return state;
    case userActionTypes.LOGOUT_SUCCESS:
      state = {...defaultState};
      return state;
    case userActionTypes.PASSWORD_RESET_SUCCESS:
      Alert.alert('Password reset', action.payload.message);
      return state;
    case userActionTypes.REGISTER_SUCCESS:
      Alert.alert('Verify Email', action.payload.message);
      return state;
    case userActionTypes.TOGGLE_LOADING:
      state = {
        ...state,
        loading: !state.loading,
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
    case userActionTypes.UPDATE_EXTRA_INFO_SUCCESS:
      state = {
        ...state,
        extraInfo: {
          ...state.extraInfo,
          posts: [action.payload.postId, ...state.extraInfo.posts],
        },
      };
      return state;
    case userActionTypes.USER_REQUEST_FAILURE:
      Alert.alert('Error', action.payload.message);
      return state;
    default:
      return state;
  }
};
export default reducer;
