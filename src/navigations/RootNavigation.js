import * as React from 'react';
import {StackActions} from '@react-navigation/native';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}
export function dispatch(action) {
  navigationRef.current?.dispatch(action);
}
export function replace(name, params) {
  navigationRef.current?.dispatch(StackActions.replace(name, params));
}
export function push(name, params) {
  navigationRef.current?.dispatch(StackActions.push(name, params));
}
export function goBack() {
  navigationRef.current?.goBack();
}
export const navigation = {
  navigate,
  dispatch,
  replace,
  push,
  goBack,
};
