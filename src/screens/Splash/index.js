import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

import AppScreen from '../../components/AppScreen';

const Splash = () => {
  return (
    <AppScreen>
      <View contentContainerStyle={styles.container}>
        <Image
          source={require('../../assets/splash.png')}
          style={styles.image}
        />
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 90,
    width: 90,
    resizeMode: 'contain',
  },
});

export default Splash;
