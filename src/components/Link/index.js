import React from 'react';
import {Alert, Linking, Text} from 'react-native';

const Link = ({url, style}) => {
  const _onPress = () => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', "Can't open this URL.");
      }
    });
  };
  return (
    <Text style={style} onPress={_onPress}>
      {url}
    </Text>
  );
};

export default Link;
