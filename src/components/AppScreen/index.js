import React from 'react';
import {Platform, SafeAreaView, StatusBar, StyleSheet} from 'react-native';

const AppScreen = ({style, children}) => {
  return (
    <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: 'white',
  },
});

export default AppScreen;
