import {Alert} from 'react-native';
import {followListActionTypes} from '../constants';

const defaultState = {
  followers: {},
  following: {},
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case followListActionTypes.FETCH_FOLLOWERS_SUCCESS:
      state.followers[action.payload.uid] = action.payload.data;
      return state;
    case followListActionTypes.FETCH_FOLLOWING_SUCCESS:
      state.following[action.payload.uid] = action.payload.data;
      return state;
    case followListActionTypes.FOLLOW_LIST_FAILURE:
      Alert.alert('Error', action.payload.message);
      return state;
    default:
      return state;
  }
};
export default reducer;
