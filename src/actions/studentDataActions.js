import firestore from '@react-native-firebase/firestore';
import {
  studentDataActionTypes,
  LIMIT_EVENTS_PER_LOADING,
  LIMIT_PLACEMENT_DATA_PER_LOADING,
  findWithAttr,
} from '../constants';
import {store} from '../store';
import moment from 'moment';

export const FetchEventsRequest = () => {
  return async (dispatch) => {
    try {
      dispatch(ToggleLoadedEvents(false));
      let today = (Date.now() / 100000) * 100000;
      let events = await firestore()
        .collection('events')
        .where('date', '>=', today)
        .orderBy('date', 'asc')
        .orderBy('order', 'asc')
        .limit(LIMIT_EVENTS_PER_LOADING)
        .get();
      let last = events.docs[events.size - 1];
      let eventsData = [];
      await Promise.all(
        events.docs.map((doc) => {
          let data = doc.data();
          let eventDate = moment(data.date).format('Do MMMM YYYY');
          let index = findWithAttr(eventsData, 'title', eventDate);
          if (index >= 0) {
            eventsData = [
              ...eventsData.slice(0, index),
              {
                ...eventsData[index],
                data: [...eventsData[index].data, {...data, id: doc.id}],
              },
              ...eventsData.slice(index + 1),
            ];

            return;
          } else {
            return eventsData.push({
              title: eventDate,
              data: [{...data, id: doc.id}],
            });
          }
        }),
      );
      if (events.size < LIMIT_EVENTS_PER_LOADING)
        dispatch(ToggleLoadedEvents(true));
      dispatch(FetchEventsListSuccess(eventsData, last));
    } catch (e) {
      console.warn(e);
      dispatch(StudentRequestFailure('Can not get events'));
    }
  };
};

export const FetchEventsListSuccess = (events, last) => {
  return {
    type: studentDataActionTypes.FETCH_EVENTS_SUCCESS,
    payload: {events, last},
  };
};

export const LoadMoreEventsRequest = () => {
  return async (dispatch) => {
    try {
      let last = store.getState().studentData.LastEvent;
      let events = await firestore()
        .collection('events')
        .orderBy('date', 'asc')
        .orderBy('order', 'asc')
        .startAfter(last)
        .limit(LIMIT_EVENTS_PER_LOADING)
        .get();
      last = events.docs[events.size - 1];
      let eventsData = [...store.getState().studentData.events];
      await Promise.all(
        events.docs.map((doc) => {
          let data = doc.data();
          let eventDate = moment(data.date).format('Do MMMM YYYY');
          let index = findWithAttr(eventsData, 'title', eventDate);
          if (index >= 0) {
            eventsData = [
              ...eventsData.slice(0, index),
              {
                ...eventsData[index],
                data: [...eventsData[index].data, {...data, id: doc.id}],
              },
              ...eventsData.slice(index + 1),
            ];
            return;
          } else {
            return eventsData.push({
              title: eventDate,
              data: [{...data, id: doc.id}],
            });
          }
        }),
      );
      if (events.size < LIMIT_EVENTS_PER_LOADING)
        dispatch(ToggleLoadedEvents(true));
      dispatch(LoadMoreEventsSuccess(eventsData, last));
    } catch (e) {
      console.warn(e);
      dispatch(StudentRequestFailure('Can not load more events'));
    }
  };
};

export const LoadMoreEventsSuccess = (events, last) => {
  return {
    type: studentDataActionTypes.LOAD_MORE_EVENTS_SUCCESS,
    payload: {events, last},
  };
};

export const FetchMagazineListRequest = () => {
  return async (dispatch) => {
    try {
      let magazines = await firestore()
        .collection('magazine')
        .orderBy('date', 'desc')
        .get();
      let magazineData = [];
      await Promise.all(
        magazines.docs.map((doc) => {
          return magazineData.push({id: doc.id, ...doc.data()});
        }),
      );
      dispatch(FetchMagazineListSuccess(magazineData));
    } catch (e) {
      console.warn(e);
      dispatch(StudentRequestFailure('Can not get magazine data'));
    }
  };
};

export const FetchMagazineListSuccess = (magazineData) => {
  return {
    type: studentDataActionTypes.FETCH_MAGAZINE_SUCCESS,
    payload: {magazineData},
  };
};

export const FetchPlacementListRequest = () => {
  return async (dispatch) => {
    try {
      dispatch(ToggleLoadedPlacement(false));
      let placements = await firestore()
        .collection('placement')
        .orderBy('year', 'desc')
        .orderBy('package', 'asc')
        .limit(LIMIT_PLACEMENT_DATA_PER_LOADING)
        .get();
      let last = placements.docs[placements.size - 1];
      let placementData = [];
      await Promise.all(
        placements.docs.map((doc) => {
          return placementData.push({...doc.data()});
        }),
      );
      if (placements.size < LIMIT_PLACEMENT_DATA_PER_LOADING)
        dispatch(ToggleLoadedPlacement(true));
      dispatch(FetchPlacementListSuccess(placementData, last));
    } catch (e) {
      console.warn(e);
      dispatch(StudentRequestFailure('Can not load placement Data'));
    }
  };
};

export const FetchPlacementListSuccess = (placementData, last) => {
  return {
    type: studentDataActionTypes.FETCH_PLACEMENT_DATA_SUCCESS,
    payload: {placementData, last},
  };
};

export const LoadMorePlacementRequest = () => {
  return async (dispatch) => {
    try {
      let last = store.getState().studentData.lastPlacementData;
      let placements = await firestore()
        .collection('placement')
        .orderBy('year', 'desc')
        .orderBy('package', 'asc')
        .startAfter(last)
        .limit(LIMIT_PLACEMENT_DATA_PER_LOADING)
        .get();
      last = placements.docs[placements.size - 1];
      let placementData = [];
      await Promise.all(
        placements.docs.map((doc) => {
          return placementData.push({...doc.data()});
        }),
      );
      if (placements.size < LIMIT_PLACEMENT_DATA_PER_LOADING)
        dispatch(ToggleLoadedPlacement(true));
      dispatch(LoadMorePlacementSuccess(placementData, last));
    } catch (e) {
      console.warn(e);
      StudentRequestFailure('Can not load more placement Data.');
    }
  };
};

export const LoadMorePlacementSuccess = (placementData, last) => {
  return {
    type: studentDataActionTypes.LOAD_MORE_PLACEMENT_DATA_SUCCESS,
    payload: {placementData, last},
  };
};

export const ToggleLoadedEvents = (value) => {
  return {
    type: studentDataActionTypes.TOGGLE_ALL_LOADED_EVENTS_SUCCESS,
    payload: {value},
  };
};

export const ToggleLoadedPlacement = (value) => {
  return {
    type: studentDataActionTypes.TOGGLE_ALL_LOADED_PLACEMENT_SUCCESS,
    payload: {value},
  };
};

export const StudentRequestFailure = (message) => {
  return {
    type: studentDataActionTypes.REQUEST_FAILURE,
    payload: {
      message,
    },
  };
};
