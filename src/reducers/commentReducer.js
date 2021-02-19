import {Alert} from 'react-native';
import {commnetActionTypes} from '../constants';

const defaultState = {};

const reducer = (state = defaultState, action) => {
  let index, data;
  switch (action.type) {
    case commnetActionTypes.FETCH_COMMENT_LIST_SUCCESS:
      state[action.payload.postId] = action.payload.data;
      return state;
    case commnetActionTypes.ADD_COMMENT_SUCCESS:
      state[action.payload.postId] = [
        action.payload.data,
        ...state[action.payload.postId],
      ];
      return state;
    case commnetActionTypes.ADD_REPLY_SUCCESS:
      index = 0;
      data = state[action.payload.postId].filter((ref, i) => {
        if (ref.title.commentId == action.payload.commentId) {
          index = i;
          return true;
        } else return false;
      })[0];
      data.data = [...data.data, action.payload.data];
      state[action.payload.postId] = [
        ...state[action.payload.postId].slice(0, index),
        data,
        ...state[action.payload.postId].slice(index + 1),
      ];
      return state;
    case commnetActionTypes.DELETE_COMMENT_SUCCESS:
      state[action.payload.postId] = [
        ...state[action.payload.postId].filter(
          (x) => x.title.commentId !== action.payload.commentId,
        ),
      ];
      return state;
    case commnetActionTypes.DELETE_REPLY_SUCCESS:
      index = 0;
      data = state[action.payload.postId].filter((ref, i) => {
        if (ref.title.commentId == action.payload.commentId) {
          index = i;
          return true;
        } else return false;
      })[0];
      data.data = [
        ...data.data.filter((x) => x.replyId !== action.payload.replyId),
      ];
      state[action.payload.postId] = [
        ...state[action.payload.postId].slice(0, index),
        data,
        ...state[action.payload.postId].slice(index + 1),
      ];
      return state;
    case commnetActionTypes.COMMENT_REQUEST_FAILURE:
      Alert.alert('Error', action.payload.message);
      return state;
    default:
      return state;
  }
};

export default reducer;
