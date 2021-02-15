import React from 'react';
import {Image, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
import {Header} from 'react-native-elements';
import {navigation} from '../../navigations/RootNavigation';

const StudentCenter = () => {
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header
        backgroundColor="transparent"
        placement="center"
        centerComponent={{
          text: 'Student Center',
          style: {color: '#000', fontSize: fontscale(24)},
        }}
      />
      <TouchableOpacity
        style={styles.container}
        onPress={() => navigation.push('Placement')}>
        <Image
          source={require('../../assets/placement.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.text}>Placement</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.container}
        onPress={() => navigation.push('Events')}>
        <Image
          source={require('../../assets/events.png')}
          style={styles.eventImage}
          resizeMode="contain"
        />
        <Text style={styles.text}>Events</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.container}
        onPress={() => navigation.push('Magazine')}>
        <Image
          source={require('../../assets/magazine.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.text}>Magazine</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: widthPercentageToDP(5),
    borderWidth: widthPercentageToDP(0.2),
    flexDirection: 'row',
    marginEnd: widthPercentageToDP(10),
    marginStart: widthPercentageToDP(10),
    marginTop: heightPercentageToDP(4),
    padding: widthPercentageToDP(4),
    paddingStart: widthPercentageToDP(6),
  },
  eventImage: {
    width: widthPercentageToDP(18),
    height: widthPercentageToDP(18),
  },
  image: {
    width: widthPercentageToDP(19),
    height: widthPercentageToDP(19),
  },
  text: {
    fontSize: fontscale(24),
    marginStart: widthPercentageToDP(6),
  },
});

export default StudentCenter;
