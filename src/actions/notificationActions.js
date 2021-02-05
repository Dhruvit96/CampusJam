import firestore from '@react-native-firebase/firestore';
import {notificationActionTypes} from '../constants';
import {store} from '../store';

export const CreateNotificationRequest = (notification) => {
  return async (dispatch) => {
    try {
      await firestore().collection('notifications').add(notification);
    } catch (e) {
      console.warn(e);
      dispatch(CreateNotificationFailure());
    }
  };
};

export const CreateNotificationFailure = () => {
  return {
    type: notificationActionTypes.CREATE_NOTIFICATION_FAILURE,
    payload: {
      message: 'Notifications Failed!',
    },
  };
};

export const FetchNotificationListRequest = () => {
  return async (dispatch) => {
    try {
      let uid = store.getState().user.userInfo.uid;
      let time = new Date().getTime() - 24 * 3600 * 7 * 1000;
      let data = await firestore()
        .collection('notifications')
        .where('userIds', 'array-contains', uid)
        .where('created_at', '>=', time)
        .orderBy('created_at', 'desc')
        .get();
      let notifications = [];
      await Promise.all(
        data.docs.map(async (ref) => {
          let notification = ref.data();
          let userInfo = await firestore()
            .collection('users')
            .doc(notification.from)
            .get();
          userInfo = userInfo.data();
          return notifications.push({
            ...notification,
            id: ref.id,
            userInfo: {
              avatar: userInfo.avatar,
              initials: userInfo.initials,
              name: userInfo.name,
            },
          });
        }),
      );
      dispatch(FetchNotificationListSuccess(notifications));
    } catch (e) {
      console.warn(e);
      dispatch(FetchNotificationListFailure());
    }
  };
};

export const FetchNotificationListFailure = () => {
  return {
    type: notificationActionTypes.FETCH_NOTIFICATIONS_FAILURE,
    payload: {
      message: 'Get Notifications Failed!',
    },
  };
};

export const FetchNotificationListSuccess = (notifications) => {
  return {
    type: notificationActionTypes.FETCH_NOTIFICATIONS_SUCCESS,
    payload: notifications,
  };
};
