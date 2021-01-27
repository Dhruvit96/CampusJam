import {postActionTypes} from '../constants';
import {Alert} from 'react-native';
const defaultState = {loaded: false, posts: []};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case postActionTypes.FETCH_POST_LIST_SUCCESS:
      state = {...state, posts: [...action.payload]};
      return state;
    case postActionTypes.LOAD_MORE_POST_LIST_SUCCESS:
      state = {...state, posts: [...state.posts, ...action.payload]};
      return state;
    case postActionTypes.TOGGLE_LIKE_POST_SUCCESS:
      state = {
        ...state,
        posts: state.posts.map((ref) => {
          if (ref.postId == action.payload.postId) {
            if (action.payload.liked) ref.likedBy.push(action.payload.uid);
            else ref.likedBy.remove(action.payload.uid);
            return ref;
          } else return ref;
        }),
      };
      return state;
    case postActionTypes.ALL_LOADED_SUCCESS:
      state = {...state, loaded: true};
      return state;
    case postActionTypes.FETCH_POST_LIST_FAILURE:
    case postActionTypes.LOAD_MORE_POST_LIST_FAILURE:
    case postActionTypes.TOGGLE_LIKE_POST_FAILURE:
      Alert.alert('Error', action.payload.message);
      return state;
    default:
      return state;
  }
};
export default reducer;
