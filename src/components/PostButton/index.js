import React from 'react';
import {Icon, Text} from 'react-native-elements';
import {TouchableOpacity} from 'react-native';
const PostButton = ({size, onPress, title, type, iconName}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 250,
        borderColor: '#6a6a6a',
        borderWidth: 0.8,
        flexDirection: 'row',
        paddingTop: 6,
        paddingBottom: 6,
        paddingStart: 45,
      }}>
      <Icon
        name={iconName}
        size={size}
        color="black"
        type={type}
        style={{marginEnd: 20}}
      />
      <Text
        style={{
          fontSize: 20,
          fontWeight: '400',
          color: 'black',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default PostButton;
