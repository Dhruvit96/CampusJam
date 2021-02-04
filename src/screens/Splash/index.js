import React from 'react';
import {View, StatusBar, StyleSheet, Image} from 'react-native';

const Splash = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.container}>
        <Image
          source={require('../../assets/splash.png')}
          style={styles.image}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  image: {
    height: 350,
    width: 350,
    resizeMode: 'contain',
  },
});

export default Splash;
