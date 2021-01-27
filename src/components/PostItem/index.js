import React, {useEffect, useState} from 'react';
import {Icon, Text} from 'react-native-elements';
import {useDispatch} from 'react-redux';

import AppScreen from '../../components/AppScreen';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
import {useSelector} from '../../store';

const PostItem = ({item, index}) => {
  const dispatch = useDispatch();
  //const [refreshing, setRefreshing] = useState();
  return <Text style={{marginTop: 100}}>{item.text}</Text>;
};

export default PostItem;
