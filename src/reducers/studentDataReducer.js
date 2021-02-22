import {Alert} from 'react-native';
import {studentDataActionTypes} from '../constants';

const defaultState = {
  placementData: [],
  events: [],
  magazineData: [],
  lastPlacementData: null,
  LastEvent: null,
  loadedEvents: false,
  loadedPlacement: false,
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case studentDataActionTypes.FETCH_EVENTS_SUCCESS:
    case studentDataActionTypes.LOAD_MORE_EVENTS_SUCCESS:
      state.events = [...action.payload.events];
      state.LastEvent = action.payload.last;
      return state;
    case studentDataActionTypes.FETCH_MAGAZINE_SUCCESS:
      state.magazineData = [...action.payload.magazineData];
      return state;
    case studentDataActionTypes.FETCH_PLACEMENT_DATA_SUCCESS:
      state.placementData = [...action.payload.placementData];
      state.lastPlacementData = action.payload.last;
      return state;

    case studentDataActionTypes.LOAD_MORE_PLACEMENT_DATA_SUCCESS:
      state.placementData = [
        ...state.placementData,
        ...action.payload.placementData,
      ];
      state.lastPlacementData = action.payload.last;
      return state;
    case studentDataActionTypes.TOGGLE_ALL_LOADED_EVENTS_SUCCESS:
      state.loadedEvents = action.payload.value;
      return state;
    case studentDataActionTypes.TOGGLE_ALL_LOADED_MAGAZINE_SUCCESS:
      state.loadedMagazine = action.payload.value;
      return state;
    case studentDataActionTypes.TOGGLE_ALL_LOADED_PLACEMENT_SUCCESS:
      state.loadedPlacement = action.payload.value;
      return state;
    case studentDataActionTypes.REQUEST_FAILURE:
      Alert.alert('Error', action.payload.message);
      return state;
    default:
      return state;
  }
};

export default reducer;
