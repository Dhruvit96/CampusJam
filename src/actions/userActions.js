import {userActionTypes} from '../constants';
import {auth, firestore} from 'firebase';

export const LoginRequest = (user) => {
  return (dispatch) => {
    return auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(async (ref) => {
        if (!ref.user.emailVerified) {
          let user = await firestore()
            .collection('users')
            .doc(ref.user.uid)
            .get();
          user = user.data();
          const result = {
            logined: true,
            ...user,
          };
          dispatch(LoginSuccess(result));
        } else dispatch(LoginFailure('Please verify your email.'));
      })
      .catch((error) => {
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
      });
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
export const RegisterRequest = ({firstName, lastName, email, password}) => {
  return (dispatch) => {
    return auth()
      .createUserWithEmailAndPassword(userData.email, userData.password)
      .then((ref) => {
        ref.user?.sendEmailVerification();
        let domain = email.substring(email.lastIndexOf('@') + 1);
        let id =
          domain.toLowerCase() === 'charusat.edu.in'
            ? email.substring(0, email.lastIndexOf('@')).toUpperCase()
            : null;
        let name = firstName + ' ' + lastName;
        let initials = firstName[0].toUpperCase() + lastName[0].toUpperCase();
        firestore().collection('users').doc(ref.user.uid).set({
          avatar: null,
          bio: null,
          email: email,
          id: id,
          initials: initials,
          name: name,
        });
        dispatch(RegisterSuccess());
      })
      .catch((error) => {
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
      });
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
