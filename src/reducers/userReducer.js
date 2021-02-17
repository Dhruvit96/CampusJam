import {findWithAttr, userActionTypes} from '../constants';
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
    likedPosts: 0,
  },
  loading: false,
};

const reducer = (state = defaultState, action) => {
  let index = 0;
  switch (action.type) {
    case userActionTypes.DECREASE_LIKED_POST_COUNT:
      state = {
        ...state,
        extraInfo: {
          ...state.extraInfo,
          likedPosts: state.extraInfo.likedPosts + 1,
        },
      };
      return state;
    case userActionTypes.DELETE_POST_SUCCESS:
      state = {
        ...state,
        extraInfo: {
          ...state.extraInfo,
          posts: [
            ...state.extraInfo.posts.filter((x) => x.postId !== action.payload),
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
      state = {
        ...state,
        extraInfo: {
          ...state.extraInfo,
          likedPosts: state.extraInfo.likedPosts + 1,
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
          posts: [action.payload, ...state.extraInfo.posts],
        },
      };
      return state;
    case userActionTypes.UPDATE_SHARED_POST_SUCCESS:
      index = findWithAttr(
        state.extraInfo.posts,
        'postId',
        action.payload.postId,
      );
      state = {
        ...state,
        extraInfo: {
          ...state.extraInfo,
          posts: [
            ...state.extraInfo.posts.slice(0, index),
            {
              ...state.extraInfo.posts[index],
              ...action.payload.data,
            },
            ...state.extraInfo.posts.slice(index + 1),
          ],
        },
      };
      return state;
    case userActionTypes.UPDATE_USER_INFO_SUCCESS:
      state = {
        ...state,
        userInfo: {
          ...state.userInfo,
          ...action.payload,
        },
        extraInfo: {
          ...state.extraInfo,
          posts: state.extraInfo.posts.map((x) => ({
            ...x,
            avatar: action.payload.avatar,
            name: action.payload.name,
          })),
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
