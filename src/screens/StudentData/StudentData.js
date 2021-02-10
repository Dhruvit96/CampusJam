import React from 'react';
import {View} from 'react-native';
import {fontscale} from '../../constants';
import {Header} from 'react-native-elements';
import EmptyList from '../../components/EmptyList';

const StudentData = () => {
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header
        backgroundColor="transparent"
        placement="center"
        centerComponent={{
          text: 'Student center',
          style: {color: '#000', fontSize: fontscale(24)},
        }}
      />
      <EmptyList message="Comming soon..." />
    </View>
  );
};

export default StudentData;
