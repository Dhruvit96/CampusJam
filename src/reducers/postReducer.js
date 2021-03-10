import {postActionTypes} from '../constants';
import {Alert} from 'react-native';
const defaultState = {loaded: false, posts: []};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case postActionTypes.ADD_POSTS_SUCCESS:
      action.payload.posts.map((x) => {
        state[x.postId] = x;
      });
      return state;
    case postActionTypes.CREATE_POST_SUCCESS:
      state = {...state, posts: [action.payload.postId, ...state.posts]};
      return state;
    case postActionTypes.DELETE_POST_SUCCESS:
      state = {
        ...state,
        posts: [...state.posts.filter((x) => x !== action.payload.postId)],
      };
      delete state[action.payload.postId];
      return state;
    case postActionTypes.FETCH_POST_LIST_SUCCESS:
      state = {...state, posts: [...action.payload]};
      return state;
    case postActionTypes.LOAD_MORE_POST_LIST_SUCCESS:
      state = {...state, posts: [...state.posts, ...action.payload]};
      return state;
    case postActionTypes.POST_REQUEST_FAILURE:
      Alert.alert('Error', action.payload.message);
      return state;
    case postActionTypes.TOGGLE_ALL_LOADED_SUCCESS:
      state = {...state, loaded: action.payload};
      return state;
    case postActionTypes.TOGGLE_LIKE_SUCCESS:
      if (typeof state[action.payload.postId] != 'undefined') {
        state[action.payload.postId] = {
          ...state[action.payload.postId],
          isLiked: !state[action.payload.postId].isLiked,
          likedBy: state[action.payload.postId].isLiked
            ? [
                ...state[action.payload.postId].likedBy.filter(
                  (x) => x !== action.payload.uid,
                ),
              ]
            : [action.payload.uid, ...state[action.payload.postId].likedBy],
        };
      }
      return state;
    case postActionTypes.UPDATE_POST_SUCCESS:
      if (typeof state[action.payload.postId] != 'undefined')
        state[action.payload.postId] = {
          ...state[action.payload.postId],
          ...action.payload.data,
        };
      return state;
    default:
      return state;
  }
};
export default reducer;
