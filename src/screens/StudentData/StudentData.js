import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import AppScreen from '../../components/AppScreen';

class StudentData extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <AppScreen>
        <Text>Placement</Text>
      </AppScreen>
    );
  }
}

export default StudentData;
