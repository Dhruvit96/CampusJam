import {
  userActionTypes,
  notificationTypes,
  seenTypes,
  uploadPhotoAsync,
  FieldValue,
} from '../constants';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {store} from '../store';
import {
  CreateNotificationRequest,
  DeleteNotificationRequest,
} from '../actions/notificationActions';

export const LoginRequest = ({email, password}) => {
  return async (dispatch) => {
    try {
      const ref = await auth().signInWithEmailAndPassword(email, password);
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
            email: email,
            isStudent: typeof user.id === 'string',
            uid: ref.user.uid,
          },
        };
        dispatch(LoginSuccess(result));
      } else dispatch(LoginFailure('Please verify your email.'));
    } catch (error) {
      let errorMessage = '';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email address or password.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many request. Try again in a minute.';
          break;
        default:
          errorMessage = 'Check your internet connection.';
      }
      dispatch(LoginFailure(errorMessage));
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
      await auth().signOut();
      dispatch(LogoutSuccess());
    } catch (e) {
      dispatch(LogoutFailure());
    }
  };
};

export const LogoutSuccess = () => {
  return {
    type: userActionTypes.LOGOUT_SUCCESS,
  };
};

export const LogoutFailure = () => {
  return {
    type: userActionTypes.LOGOUT_FAILURE,
    payload: {
      message: 'Can not logout now!',
    },
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
          followings: [],
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

export const passwordResetRequest = (email) => {
  return async (dispatch) => {
    try {
      await auth().sendPasswordResetEmail(email);
      dispatch(
        passwordResetSuccess(
          'Please check your inbox for password reset mail.',
        ),
      );
    } catch (error) {
      let errorMessage = '';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'User with this email does not exist.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many request. Try again in a minute.';
          break;
        default:
          errorMessage = 'Check your internet connection.';
      }
      dispatch(passwordResetFailure(errorMessage));
    }
  };
};

export const ChangePasswordRequest = ({password, newPassword}) => {
  return async (dispatch) => {
    try {
      let email = store.getState().user.userInfo.email;
      await auth()
        .signInWithEmailAndPassword(email, password)
        .then(async (ref) => {
          await ref.user.updatePassword(newPassword);
        });
      dispatch(passwordResetSuccess('Password Changed successfully.'));
    } catch (error) {
      let errorMessage = '';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'User with this email does not exist.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Invalid password.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many request. Try again in a minute.';
          break;
        default:
          errorMessage = 'Check your internet connection.';
      }
      dispatch(passwordResetFailure(errorMessage));
    }
  };
};

export const passwordResetFailure = (errorMessage) => {
  return {
    payload: {
      message: errorMessage,
    },
    type: userActionTypes.PASSWORD_RESET_FAILURE,
  };
};

export const passwordResetSuccess = (message) => {
  return {
    payload: {
      message,
    },
    type: userActionTypes.PASSWORD_RESET_SUCCESS,
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

      let postsData = await firestore()
        .collection('posts')
        .where('uid', '==', currentUser.uid)
        .orderBy('created_at', 'desc')
        .get();
      let posts = await firestore()
        .collection('posts')
        .where('likedBy', 'array-contains', currentUser.uid)
        .get();
      let likedPosts = posts.size;
      posts = [];
      await Promise.all(
        postsData.docs.map(async (doc) => {
          let postData = doc.data();
          return posts.push({
            ...postData,
            avatar: currentUser.avatar,
            postId: doc.id,
            initials: currentUser.initials,
            name: currentUser.name,
            isSelf: true,
            isLiked: postData.likedBy.indexOf(currentUser.uid) >= 0,
          });
        }),
      );
      let followersData = await firestore()
        .collection('users')
        .where('followings', 'array-contains', currentUser.uid)
        .get();

      let userData = (
        await firestore().collection('users').doc(currentUser.uid).get()
      ).data();
      let followers = [];

      followersData.forEach((ref) => followers.push(ref.id));

      const payload = {
        userInfo: {
          followings: userData.followings,
        },
        extraInfo: {
          posts: posts,
          followers: followers,
          likedPosts: likedPosts,
        },
      };
      dispatch(FetchExtraInfoSuccess(payload));
    } catch (e) {
      console.warn(e);
      dispatch(FetchExtraInfoFailure());
    }
  };
};

export const ToggleLoading = () => {
  return {
    type: userActionTypes.TOGGLE_LOADING,
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

export const UpdateExtraInfoRequest = (payload) => {
  return {
    type: userActionTypes.UPDATE_EXTRA_INFO_SUCCESS,
    payload: payload,
  };
};

export const UpdateUserInfoRequest = ({avatar, bio, name}) => {
  return async (dispatch) => {
    try {
      let currentUser = {...store.getState().user.userInfo};
      let photo = avatar
        ? avatar == currentUser.avatar
          ? avatar
          : await uploadPhotoAsync(avatar, `profile/${currentUser.uid}/avatar`)
        : null;
      let userName = name.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
      let initials = userName
        .match(/\b(\w)/g)
        .join('')
        .slice(0, 2);
      let userInfo = {
        avatar: photo,
        bio: bio,
        initials: initials,
        name: userName,
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

export const UpdateSharedPostRequest = (payload) => {
  return {
    type: userActionTypes.UPDATE_SHARED_POST_SUCCESS,
    payload: payload,
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
      if (!currentUser.followings.includes(uid)) {
        await firestore()
          .collection('users')
          .doc(currentUser.uid)
          .update({
            followings: FieldValue.arrayUnion(uid),
          });
      }
      dispatch(
        CreateNotificationRequest({
          postId: 0,
          userIds: [uid],
          from: currentUser.uid,
          created_at: Date.now(),
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
      if (currentUser.followings.includes(uid)) {
        await firestore()
          .collection('users')
          .doc(currentUser.uid)
          .update({
            followings: FieldValue.arrayRemove(uid),
          });
        dispatch(
          DeleteNotificationRequest({
            userIds: [uid],
            uid: currentUser.uid,
            type: notificationTypes.FOLLOWED_ME,
          }),
        );
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

export const DeleteSharedPostSuccess = (postId) => {
  return {
    type: userActionTypes.DELETE_POST_SUCCESS,
    payload: postId,
  };
};

export const IncreaseLikedPostCountRequest = () => {
  return {
    type: userActionTypes.INCREASE_LIKED_POST_COUNT,
  };
};

export const DecreaseLikedPostCountRequest = () => {
  return {
    type: userActionTypes.DECREASE_LIKED_POST_COUNT,
  };
};
