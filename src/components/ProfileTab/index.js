import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-elements';
import {fontscale, widthPercentageToDP} from '../../constants';

const ProfileTab = ({name, count}) => {
  return (
    <TouchableOpacity
      style={{flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
      <View>
        <Text style={styles.text}>{name}</Text>
        <Text style={[styles.text, {color: 'black'}]}>{count}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    alignSelf: 'center',
    color: 'grey',
    fontSize: fontscale(18),
    fontWeight: 'normal',
    padding: widthPercentageToDP(0.6),
  },
});

export default ProfileTab;
