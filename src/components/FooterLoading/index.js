import React from 'react';
import LottieView from 'lottie-react-native';
import {widthPercentageToDP} from '../../constants';
const FooterLoading = () => {
  return (
    <LottieView
      source={require('../../assets/animations/loader.json')}
      autoPlay
      style={{
        height: widthPercentageToDP(10),
        width: widthPercentageToDP(10),
        alignSelf: 'center',
      }}
    />
  );
};

export default FooterLoading;
