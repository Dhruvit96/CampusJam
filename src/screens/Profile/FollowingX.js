import React from 'react';
import {Header} from 'react-native-elements';
import {StatusBar, View} from 'react-native';
import {fontscale} from '../../constants';
import FollowingList from './FollowingList';
import {navigation} from '../../navigations/RootNavigation';
const FollowingX = ({route}) => {
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar barStyle="dark-content" />
      <Header
        backgroundColor="transparent"
        placement="center"
        leftComponent={{
          icon: 'arrow-back',
          color: '#000',
          size: fontscale(24),
          onPress: () => {
            navigation.goBack();
          },
        }}
        centerComponent={{
          text: 'Following list',
          style: {color: '#000', fontSize: fontscale(24)},
        }}
      />
      <FollowingList userId={route.params.uid} />
    </View>
  );
};

export default FollowingX;
