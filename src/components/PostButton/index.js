import React from 'react';
import {Icon, Text} from 'react-native-elements';
import {TouchableOpacity} from 'react-native';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
const PostButton = ({size, onPress, title, type, iconName}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: widthPercentageToDP(60),
        borderColor: '#6a6a6a',
        borderWidth: 0.8,
        flexDirection: 'row',
        paddingTop: heightPercentageToDP(0.6),
        paddingBottom: heightPercentageToDP(0.8),
        paddingStart: widthPercentageToDP(11),
      }}>
      <Icon
        name={iconName}
        size={size}
        color="black"
        type={type}
        style={{marginEnd: widthPercentageToDP(5)}}
      />
      <Text
        style={{
          fontSize: fontscale(18),
          fontWeight: '400',
          color: 'black',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default PostButton;
