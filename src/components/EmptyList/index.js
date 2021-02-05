import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import {fontscale, heightPercentageToDP} from '../../constants';

const EmptyList = ({message}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: heightPercentageToDP(74),
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: fontscale(24),
  },
});

export default EmptyList;
