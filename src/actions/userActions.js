import {
  userActionTypes,
  notificationTypes,
  seenTypes,
  uploadPhotoAsync,
  FieldValue,
  TimeStamp,
} from '../constants';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {store} from '../store';
import {CreateNotificationRequest} from '../actions/notificationActions';

export const LoginRequest = (user) => {
  return async (dispatch) => {
    try {
      const ref = await auth().signInWithEmailAndPassword(
        user.email,
        user.password,
      );
      if (ref.user.emailVerified) {
        let user = await firestore()
          .collection('users')
          .doc(ref.user.uid)
          .get();
        user = user.data();
        const result = {
          logined: true,
          userInfo: {
            ...user,
            isStudent: typeof user.id === 'string',
            uid: ref.user.uid,
          },
        };
        dispatch(LoginSuccess(result));
      } else dispatch(LoginFailure('Please verify your email.'));
    } catch (error) {
      let errorMessage_1 = '';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage_1 = 'Invalid email address format.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage_1 = 'Invalid email address or password.';
          break;
        case 'auth/too-many-requests':
          errorMessage_1 = 'Too many request. Try again in a minute.';
          break;
        default:
          errorMessage_1 = 'Check your internet connection.';
      }
      dispatch(LoginFailure(errorMessage_1));
    }
  };
};
export const LoginFailure = (errorMessage) => {
  return {
    type: userActionTypes.LOGIN_FAILURE,
    payload: {
      message: errorMessage,
    },
  };
};
export const LoginSuccess = (payload) => {
  return {
    type: userActionTypes.LOGIN_SUCCESS,
    payload: payload,
  };
};

export const LogoutRequest = () => {
  return async (dispatch) => {
    try {
      auth().signOut();
      dispatch({
        type: userActionTypes.LOGOUT_SUCCESS,
        payload: {},
      });
    } catch (e) {
      dispatch({
        type: userActionTypes.LOGOUT_FAILURE,
        payload: {
          message: 'Can not logout now!',
        },
      });
    }
  };
};

export const RegisterRequest = ({firstName, lastName, email, password}) => {
  return async (dispatch) => {
    try {
      const ref = await auth().createUserWithEmailAndPassword(email, password);
      ref.user?.sendEmailVerification();
      let domain = email.substring(email.lastIndexOf('@') + 1);
      let id =
        domain.toLowerCase() === 'charusat.edu.in'
          ? email.substring(0, email.lastIndexOf('@')).toUpperCase()
          : null;
      let name = firstName + ' ' + lastName;
      let initials = firstName[0].toUpperCase() + lastName[0].toUpperCase();
      await firestore()
        .collection('users')
        .doc(ref.user.uid)
        .set({
          avatar: null,
          bio: null,
          email: email,
          following: [],
          id: id,
          initials: initials,
          name: name,
          notificationSettings: {
            posts: true,
            comments: true,
            likes: true,
            followed: true,
            pauseAll: false,
          },
        });
      dispatch(RegisterSuccess());
    } catch (error) {
      let errorMessage = '';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'E-mail already in use.';
          break;
        case 'auth//weak-password':
          errorMessage = 'Password is too weak.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Invalid email address or password.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many request. Try again in a minute.';
          break;
        default:
          errorMessage = 'Check your internet connection.';
      }
      dispatch(RegisterFailure(errorMessage));
    }
  };
};
export const RegisterFailure = (errorMessage) => {
  return {
    payload: {
      message: errorMessage,
    },
    type: userActionTypes.REGISTER_FAILURE,
  };
};
export const RegisterSuccess = () => {
  return {
    payload: {
      message: 'Please check your inbox for verification.',
    },
    type: userActionTypes.REGISTER_SUCCESS,
  };
};

export const FetchExtraInfoRequest = () => {
  return async (dispatch) => {
    try {
      let currentUser = {...store.getState().user.userInfo};

      let postData = await firestore()
        .collection('posts')
        .where('userId', '==', currentUser.uid)
        .orderBy('create_at', 'desc')
        .get();

      let followersData = await firestore()
        .collection('users')
        .where('followings', 'array-contains', currentUser.uid)
        .get();

      let followings = (
        await ref.collection('users').doc(currentUser.uid).get()
      ).data();
      let followers = [];

      followersData.forEach((ref) => followers.push(ref.id));

      const payload = {
        userInfo: {
          followings: followings,
        },
        extraInfo: {
          posts: postData.docs.map((x) => x.data()),
          followers: followers,
        },
      };
      dispatch(FetchExtraInfoSuccess(payload));
    } catch (e) {
      console.warn(e);
      dispatch(FetchExtraInfoFailure());
    }
  };
};

export const FetchExtraInfoFailure = () => {
  return {
    type: userActionTypes.FETCH_EXTRA_INFO_FAILURE,
    payload: {
      message: `Can't get information`,
    },
  };
};

export const FetchExtraInfoSuccess = (extraInfo) => {
  return {
    type: userActionTypes.FETCH_EXTRA_INFO_SUCCESS,
    payload: extraInfo,
  };
};

export const UpdateUserInfoRequest = ({avatar, bio, name}) => {
  return async (dispatch) => {
    try {
      let currentUser = {...store.getState().user.userInfo};
      let photo = avatar
        ? avatar == currentUser.avatar
          ? avatar
          : await uploadPhotoAsync(avatar, 'profile/' + user)
        : null;
      let userInfo = {
        avatar: photo,
        bio: bio,
        name: name,
      };
      firestore().collection('users').doc(currentUser.uid).update(userInfo);
      dispatch(UpdateUserInfoSuccess(userInfo));
    } catch (e) {
      console.warn(e);
      dispatch(UpdateUserInfoFailure());
    }
  };
};

export const UpdateUserInfoFailure = () => {
  return {
    type: userActionTypes.UPDATE_USER_INFO_FAILURE,
    payload: {
      message: `Can't update now, try again!`,
    },
  };
};

export const UpdateUserInfoSuccess = (user) => {
  return {
    type: userActionTypes.UPDATE_USER_INFO_SUCCESS,
    payload: user,
  };
};

export const UpdateNotificationSettingsRequest = (setting) => {
  return async (dispatch) => {
    try {
      let currentUser = {...store.getState().user.userInfo};
      await firestore().collection('user').doc(currentUser.uid).update({});
      dispatch(UpdateNotificationSettingSuccess(setting));
    } catch (e) {
      dispatch(UpdateNotificationSettingFailure());
    }
  };
};

export const UpdateNotificationSettingSuccess = (payload) => {
  return {
    type: userActionTypes.UPDATE_NOTIFICATION_SETTING_SUCCESS,
    payload,
  };
};

export const UpdateNotificationSettingFailure = () => {
  return {
    type: userActionTypes.UPDATE_NOTIFICATION_SETTING_FAILURE,
    payload: {
      message: `Error! Can't update setting`,
    },
  };
};

export const followRequest = (uid) => {
  return async (dispatch) => {
    try {
      let currentUser = {...store.getState().user.userInfo};
      if (!currentUser.following.includes(uid)) {
        await userRef.doc(currentUser.uid).update({
          following: FieldValue.arrayUnion(uid),
        });
      }
      dispatch(
        CreateNotificationRequest({
          postId: 0,
          userId: uid,
          from: currentUser.uid,
          created_at: TimeStamp(),
          seen: seenTypes.NOTSEEN,
          type: notificationTypes.FOLLOWED_ME,
        }),
      );
      dispatch(followSuccess(uid));
    } catch (e) {
      console.warn(e);
      dispatch(followFailure());
    }
  };
};
export const followFailure = () => {
  return {
    type: userActionTypes.FOLLOW_FAILURE,
    payload: {
      message: `Can't follow this people!`,
    },
  };
};
export const followSuccess = (user) => {
  return {
    type: userActionTypes.FOLLOW_SUCCESS,
    payload: user,
  };
};

export const UnfollowRequest = (uid) => {
  return async (dispatch) => {
    try {
      let currentUser = {...store.getState().user.userInfo};
      if (currentUser.following.includes(uid)) {
        await userRef.doc(currentUser.uid).update({
          following: FieldValue.arrayRemove(getUid()),
        });
      }
      dispatch(UnfollowSuccess(uid));
    } catch (e) {
      console.warn(e);
      dispatch(UnfollowFailure());
    }
  };
};
export const UnfollowFailure = () => {
  return {
    type: userActionTypes.UNFOLLOW_FAILURE,
    payload: {
      message: `Can't unfollow this people!`,
    },
  };
};
export const UnfollowSuccess = (user) => {
  return {
    type: userActionTypes.UNFOLLOW_SUCCESS,
    payload: user,
  };
};
