import React from 'react';
import {
  Alert,
  Image,
  Linking,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';

const AboutUs = () => {
  const _onPressGitHub = () => {
    Linking.canOpenURL('https://github.com/Dhruvit96').then((supported) => {
      if (supported) {
        Linking.openURL('https://github.com/Dhruvit96');
      } else {
        Alert.alert('Error', "Can't open this URL.");
      }
    });
  };
  const _onPressLinkedin = () => {
    Linking.canOpenURL('https://linkedin.com/in/dhruvit-maniya').then(
      (supported) => {
        if (supported) {
          Linking.openURL('https://linkedin.com/in/dhruvit-maniya');
        } else {
          Alert.alert('Error', "Can't open this URL.");
        }
      },
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Image
        source={require('../../assets/aboutus.png')}
        style={styles.image}
      />
      <Text style={styles.heading}>There's a lot happening around you!</Text>
      <Text>
        Our Mission is to provide what's happening near you, share your ideas,
        browse and search, for the type of events you like to attend.
      </Text>
      <Text style={{marginTop: heightPercentageToDP(2)}}>
        Devloped By Dhruvit Maniya.
      </Text>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          marginTop: heightPercentageToDP(1),
          alignItems: 'center',
        }}
        onPress={_onPressGitHub}>
        <FontAwesome name="github" size={fontscale(25)} />
        <Text
          style={{
            marginStart: widthPercentageToDP(3),
          }}>
          github.com/Dhruvit96
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          marginTop: heightPercentageToDP(1),
          marginBottom: heightPercentageToDP(1),
          alignItems: 'center',
        }}
        onPress={_onPressLinkedin}>
        <FontAwesome name="linkedin-square" size={fontscale(25)} />
        <Text
          style={{
            marginStart: widthPercentageToDP(3),
          }}>
          linkedin.com/in/dhruvit-maniya
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: widthPercentageToDP(2),
    paddingTop: StatusBar.currentHeight,
  },
  heading: {
    fontSize: fontscale(19),
    marginTop: heightPercentageToDP(5),
    marginBottom: heightPercentageToDP(4),
  },
  image: {
    width: widthPercentageToDP(100),
    height: heightPercentageToDP(60),
    alignSelf: 'center',
  },
});

export default AboutUs;
