import React from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Header, Icon} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {LogoutRequest} from '../../actions/userActions';
import {fontscale, widthPercentageToDP} from '../../constants';
import {navigation} from '../../navigations/RootNavigation';

const Settings = () => {
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        backgroundColor="transparent"
        placement="center"
        leftComponent={{
          icon: 'arrow-back',
          color: '#000',
          size: fontscale(27),
          onPress: () => navigation.goBack(),
        }}
        centerComponent={{
          text: 'Settings',
          style: {color: '#000', fontSize: fontscale(24)},
        }}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.push('ChangePassword');
        }}>
        <Icon name="lock-outline" />
        <Text style={styles.buttonText}>Change Password</Text>
        <View style={styles.leftIcon}>
          <Icon name="arrow-forward" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Icon name="info-outline" />
        <Text style={styles.buttonText}>About Us</Text>
        <View style={styles.leftIcon}>
          <Icon name="arrow-forward" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          dispatch(LogoutRequest());
        }}>
        <Icon name="logout" />
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  button: {
    width: '80%',
    margin: widthPercentageToDP(10),
    marginBottom: -widthPercentageToDP(4),
    borderRadius: widthPercentageToDP(2),
    padding: widthPercentageToDP(3.5),
    borderWidth: 1.5,
    alignItems: 'center',
    borderColor: 'grey',
    flexDirection: 'row',
  },
  buttonText: {
    marginStart: widthPercentageToDP(5),
    fontSize: fontscale(18),
  },
  leftIcon: {
    position: 'absolute',
    end: widthPercentageToDP(5),
  },
});
export default Settings;
