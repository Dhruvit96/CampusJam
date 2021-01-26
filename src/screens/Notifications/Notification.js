import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import AppScreen from '../../components/AppScreen';

class Notification extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <AppScreen>
        <Text>Notification</Text>
      </AppScreen>
    );
  }
}

export default Notification;
