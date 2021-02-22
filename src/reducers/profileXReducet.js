import {Alert} from 'react-native';
import {profileXActionTypes} from '../constants';

const defaultState = {};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case profileXActionTypes.FETCH_USER_X_SUCCESS:
      state[action.payload.uid] = action.payload.data;
      return state;
    case profileXActionTypes.FETCH_USER_X_FAILURE:
      Alert.alert('Error', action.payload.message);
      return state;
    case profileXActionTypes.FOLLOW_SUCCESS:
      if (typeof state[action.payload.uid] !== 'undefined') {
        state[action.payload.uid] = {
          ...state[action.payload.uid],
          followers: [
            action.payload.currentUid,
            ...state[action.payload.uid].followers,
          ],
          isFollowed: true,
        };
      }
      return state;
    case profileXActionTypes.UNFOLLOW_SUCCESS:
      if (typeof state[action.payload.uid] !== 'undefined') {
        state[action.payload.uid] = {
          ...state[action.payload.uid],
          followers: [
            ...state[action.payload.uid].followers.filter(
              (x) => x !== action.payload.currentUid,
            ),
          ],
          isFollowed: false,
        };
      }
      return state;
    default:
      return state;
  }
};

export default reducer;
