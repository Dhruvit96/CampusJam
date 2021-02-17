import {findWithAttr, postActionTypes} from '../constants';
import {Alert} from 'react-native';
const defaultState = {loaded: false, posts: []};

const reducer = (state = defaultState, action) => {
  let index = 0;
  switch (action.type) {
    case postActionTypes.CREATE_POST_SUCCESS:
      state = {...state, posts: [action.payload, ...state.posts]};
      return state;
    case postActionTypes.DELETE_POST_SUCCESS:
      index = findWithAttr(state.posts, 'postId', action.payload);
      if (index >= 0)
        state = {
          ...state,
          posts: [...state.posts.filter((x) => x.postId !== action.payload)],
        };
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
    case postActionTypes.UPDATE_POST_SUCCESS:
      index = findWithAttr(state.posts, 'postId', action.payload.postId);
      if (index > -1)
        state = {
          ...state,
          posts: [
            ...state.posts.slice(0, index),
            {...state.posts[index], ...action.payload.data},
            ...state.posts.slice(index + 1),
          ],
        };
      return state;
    default:
      return state;
  }
};
export default reducer;
