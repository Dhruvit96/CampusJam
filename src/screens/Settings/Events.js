import React from 'react';
import {StyleSheet, StatusBar, Text, View} from 'react-native';

const Events = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text>Events</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: StatusBar.currentHeight,
  },
});

export default Events;
