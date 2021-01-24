import {userXActionTypes} from '../constants';
export const defaultUserState = {};
const reducer = (state = defaultUserState, action) => {
  switch (action.type) {
    case userXActionTypes.FETCH_PROFILEX_SUCCESS:
      state = {...state, ...action.payload};
      return state;
    case userXActionTypes.FETCH_PROFILEX_FAILURE:
      Alert.alert('Error', action.payload.message);
      return state;
    default:
      return state;
  }
};
export default reducer;
