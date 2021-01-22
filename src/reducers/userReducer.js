import {userActionTypes} from '../constants';
import {Alert} from 'react-native';
const defaultState = {
  avatar: null,
  bio: null,
  email: '',
  id: '',
  initials: '',
  logined: false,
  name: '',
};

const reducer = (state = defaultState, action) => {
  let message = '';
  switch (action.type) {
    case userActionTypes.LOGIN_REQUEST:
      state = {
        avatar: null,
        bio: null,
        email: '',
        id: '',
        initials: '',
        logined: false,
        name: '',
      };
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
      state = {
        avatar: null,
        bio: null,
        email: '',
        id: '',
        initials: '',
        logined: false,
        name: '',
      };
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
