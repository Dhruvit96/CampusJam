import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-elements';

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
    fontSize: 20,
    fontWeight: 'normal',
    padding: 2,
  },
});

export default ProfileTab;
