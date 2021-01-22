import React, {useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Avatar, Button, Input, Text} from 'react-native-elements';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {navigation} from '../../navigations/RootNavigation';
import {LoginRequest} from '../../actions/userActions';
import Loading from '../../components/Loading';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().label('Password'),
});

const Login = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {_onLogin, _onPressRegister, _onPressForgotPassword} = getEventHandlers(
    setLoading,
    dispatch,
  );
  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <Loading isVisible={loading} />
      <View style={styles.container}>
        <Avatar
          rounded
          size={130}
          source={require('../../assets/logo.png')}
          imageProps={{resizeMode: 'stretch'}}
          containerStyle={{backgroundColor: '#523', margin: 20}}
        />
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'white',
            borderTopLeftRadius: 75,
            alignItems: 'center',
          }}>
          <Text h1 h1Style={{marginTop: 50, fontWeight: '200'}}>
            Login
          </Text>
          <View
            style={{
              width: 350,
              marginTop: 30,
              alignItems: 'flex-end',
            }}>
            <Formik
              initialValues={{email: '', password: ''}}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                _onLogin(values);
              }}>
              {({
                errors,
                handleChange,
                handleSubmit,
                setFieldTouched,
                touched,
              }) => (
                <>
                  <Input
                    autoCapitalize="none"
                    errorMessage={touched.email ? errors.email : ''}
                    errorStyle={styles.errorText}
                    inputStyle={[styles.text, {fontSize: 20}]}
                    label="Email"
                    labelStyle={styles.text}
                    onBlur={() => setFieldTouched('email')}
                    onChangeText={handleChange('email')}
                    textContentType="emailAddress"
                    //onSubmitEditing={() => {
                    //  this.password.focus();
                    //}}
                  />
                  <Input
                    autoCapitalize="none"
                    errorMessage={touched.password ? errors.password : ''}
                    errorStyle={styles.errorText}
                    inputStyle={[styles.text, styles.titleText]}
                    label="Password"
                    labelStyle={styles.text}
                    onBlur={() => setFieldTouched('password')}
                    onChangeText={handleChange('password')}
                    secureTextEntry
                    textContentType="password"
                    //ref={(input) => {
                    //  this.password = input;
                    //}}
                  />
                  <TouchableOpacity
                    style={{marginEnd: 10}}
                    onPress={() => {
                      _onPressForgotPassword();
                    }}>
                    <Text style={styles.buttonText}>Forgot Password?</Text>
                  </TouchableOpacity>
                  <Button
                    buttonStyle={styles.submit}
                    onPress={handleSubmit}
                    title={'Login'}
                    titleStyle={[styles.text, {color: 'white', fontSize: 24}]}
                  />
                </>
              )}
            </Formik>
            <View
              style={{
                width: 330,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{marginTop: 12}}
                onPress={() => {
                  _onPressRegister();
                }}>
                <Text style={styles.buttonText}>
                  Don't have account? Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

function getEventHandlers(setLoading, dispatch) {
  const _onPressRegister = () => {
    navigation.push('SignUp');
  };
  const _onPressForgotPassword = () => {
    navigation.push('ForgotPassword');
  };
  const _onLogin = async (data) => {
    setLoading(true);
    await dispatch(LoginRequest(data));
    setLoading(false);
  };
  return {
    _onLogin,
    _onPressRegister,
    _onPressForgotPassword,
  };
}

const styles = StyleSheet.create({
  buttonText: {color: 'black', fontSize: 18},
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#61c0ff',
  },
  errorText: {
    fontSize: 20,
    color: 'red',
  },
  submit: {
    backgroundColor: '#61c0ff',
    width: 330,
    height: 50,
    marginEnd: 10,
    marginTop: 35,
  },
  text: {
    fontWeight: '300',
    fontSize: 20,
    color: 'black',
  },
  titleText: {fontSize: 20},
});

export default Login;
