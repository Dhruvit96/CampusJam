import {Alert} from 'react-native';
import {notificationActionTypes} from '../constants';

const defaultState = [];

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case notificationActionTypes.FETCH_NOTIFICATIONS_REQUEST:
      state = [...defaultState];
      return state;
    case notificationActionTypes.FETCH_NOTIFICATIONS_SUCCESS:
      state = [...action.payload];
      return state;
    case notificationActionTypes.FETCH_NOTIFICATIONS_FAILURE:
      Alert.alert('Error', action.payload.message);
      return state;
    default:
      return state;
  }
};
export default reducer;
