import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import AppScreen from '../../components/AppScreen';

class Posts extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <AppScreen>
        <Text>Posts</Text>
      </AppScreen>
    );
  }
}

export default Posts;
