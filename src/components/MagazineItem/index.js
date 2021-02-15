import moment from 'moment';
import React from 'react';
import {
  Alert,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-elements';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
import {navigation} from '../../navigations/RootNavigation';

const MagazineItem = ({item}) => {
  const _onPressDownload = () => {
    Linking.canOpenURL(item.download).then((supported) => {
      if (supported) {
        Linking.openURL(item.download);
      } else {
        Alert.alert('Error', "Can't open this URL.");
      }
    });
  };
  const _onPressRead = () => {
    navigation.push('PDFViewer', {pdf: item.url});
  };
  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={{uri: item.cover}}
          style={{
            width: widthPercentageToDP(25),
            height: widthPercentageToDP(25) * item.scale,
          }}
          resizeMode="contain"
        />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          marginStart: widthPercentageToDP(2),
        }}>
        <Text style={styles.text}>{'Name: ' + item.name}</Text>
        <Text style={styles.text}>
          {'Published Date: ' + moment(item.date).format('L')}
        </Text>
        <View style={{flexDirection: 'row', marginTop: widthPercentageToDP(3)}}>
          <TouchableOpacity onPress={_onPressRead} style={styles.button}>
            <Text style={styles.text}>Read</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={_onPressDownload} style={styles.button}>
            <Text style={styles.text}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    flex: 1,
    margin: widthPercentageToDP(1.4),
    height: heightPercentageToDP(5),
    paddingStart: widthPercentageToDP(1),
    paddingEnd: widthPercentageToDP(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    margin: widthPercentageToDP(3),
    marginBottom: widthPercentageToDP(1),
    padding: widthPercentageToDP(4),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    borderRadius: widthPercentageToDP(2),
    backgroundColor: 'white',
  },
  text: {
    fontSize: fontscale(16),
    padding: widthPercentageToDP(1),
  },
});

export default MagazineItem;
