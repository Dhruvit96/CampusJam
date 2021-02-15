import React from 'react';
import {View, StatusBar, StyleSheet, Image} from 'react-native';
import {widthPercentageToDP} from '../../constants';

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
    height: widthPercentageToDP(80),
    width: widthPercentageToDP(80),
    resizeMode: 'contain',
  },
});

export default Splash;
