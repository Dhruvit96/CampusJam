import {userActionTypes} from '../constants';
import {Alert} from 'react-native';
const defaultState = {
  avatar: null,
  bio: '',
  email: '',
  id: '',
  initials: '',
  isStudent: false,
  logined: false,
  name: '',
  uid: '',
};

const reducer = (state = defaultState, action) => {
  let message = '';
  switch (action.type) {
    case userActionTypes.LOGIN_REQUEST:
      state = defaultState;
      return state;
    case userActionTypes.LOGIN_SUCCESS:
      state = {...state, ...action.payload};
      console.log(state);
      return state;
    case userActionTypes.LOGIN_FAILURE:
      message = action.payload.message;
      Alert.alert('Error', message);
      return state;
    case userActionTypes.REGISTER_REQUEST:
      state = defaultState;
      return state;
    case userActionTypes.REGISTER_SUCCESS:
      message = action.payload.message;
      Alert.alert('Verify Email', message);
      return state;
    case userActionTypes.REGISTER_FAILURE:
      message = action.payload.message;
      Alert.alert('Error', message);
      return state;
    default:
      return state;
  }
};
export default reducer;
