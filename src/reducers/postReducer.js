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
