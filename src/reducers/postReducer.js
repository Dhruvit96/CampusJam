import {postActionTypes} from '../constants';
import {Alert} from 'react-native';
const defaultState = {loaded: false, posts: []};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case postActionTypes.FETCH_POST_LIST_SUCCESS:
      state = {...state, posts: [...action.payload]};
      return state;
    case postActionTypes.LOAD_MORE_POST_LIST_SUCCESS:
      state = {...state, posts: [...state.posts.concat(action.payload)]};
      return state;
    case postActionTypes.TOGGLE_LIKE_POST_SUCCESS:
      state = {
        ...state,
        posts: [
          ...state.posts.map((ref) => {
            if (ref.postId == action.payload.postId) {
              if (ref.isLiked) {
                let index = ref.likedBy.indexOf(action.payload.uid);
                ref.likedBy.splice(index, index + 1);
                ref.isLiked = false;
              } else {
                ref.likedBy.push(action.payload.uid);
                ref.isLiked = true;
              }
              return ref;
            } else return ref;
          }),
        ],
      };
      return state;
    case postActionTypes.TOGGLE_FOLLOW_USER_SUCCESS:
      state = {
        ...state,
        posts: [
          ...state.posts.map((ref) => {
            if (ref.uid == action.payload) {
              if (ref.isFollowed) {
                ref.isFollowed = false;
              } else {
                ref.isFollowed = true;
              }
              return ref;
            } else return ref;
          }),
        ],
      };
      return state;
    case postActionTypes.TOGGLE_ALL_LOADED_SUCCESS:
      state = {...state, loaded: action.payload};
      return state;
    case postActionTypes.FETCH_POST_LIST_FAILURE:
    case postActionTypes.LOAD_MORE_POST_LIST_FAILURE:
    case postActionTypes.TOGGLE_LIKE_POST_FAILURE:
    case postActionTypes.TOGGLE_FOLLOW_USER_FAILURE:
      Alert.alert('Error', action.payload.message);
      return state;
    default:
      return state;
  }
};
export default reducer;
