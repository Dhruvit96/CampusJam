import * as firebase from 'firebase';
import '@firebase/firestore';
import '@firebase/auth';
import '@firebase/storage';
const firebaseConfig = {
  apiKey: 'AIzaSyAk9n0uJTaJzkP7oggoKJ2er6-p7VF7DGI',
  authDomain: 'campusjam-dm.firebaseapp.com',
  projectId: 'campusjam-dm',
  storageBucket: 'campusjam-dm.appspot.com',
  messagingSenderId: '710197339433',
  appId: '1:710197339433:web:aebcb8dedba049cafcc338',
  measurementId: 'G-XPH9LGXC6D',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const userActionTypes = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  REGISTER_REQUEST: 'REGISTER_REQUEST',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
};
