import React, {useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Icon, Input, Text} from 'react-native-elements';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {navigation} from '../../navigations/RootNavigation';
import {RegisterRequest} from '../../actions/userActions';
import Loading from '../../components/Loading';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required().label('First Name'),
  lastName: Yup.string().required().label('Last Name'),
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password'),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .label('Confirm Password'),
});

const SignUpScreen = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {_onRegister, _onPressBack} = getEventHandlers(setLoading, dispatch);

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <Loading isVisible={loading} />
      <View style={styles.container}>
        <View
          style={{
            width: '100%',
            height: heightPercentageToDP(10),
            flexDirection: 'row',
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-start',
              marginStart: widthPercentageToDP(4),
            }}>
            <TouchableOpacity onPress={_onPressBack}>
              <Icon name="arrow-back" size={fontscale(30)} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={{flex: 2, justifyContent: 'center'}}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: fontscale(34),
                color: '#fff',
              }}>
              Sign Up
            </Text>
          </View>
          <View style={{flex: 1}} />
        </View>
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'white',
            borderTopLeftRadius: widthPercentageToDP(12),
            alignItems: 'center',
          }}>
          <View
            style={{
              width: widthPercentageToDP(80),
              marginTop: heightPercentageToDP(5),
              alignItems: 'flex-end',
            }}>
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={validationSchema}
              onSubmit={_onRegister}>
              {({
                errors,
                handleChange,
                handleSubmit,
                setFieldTouched,
                touched,
              }) => (
                <>
                  <Input
                    autoCapitalize="words"
                    errorMessage={touched.firstName ? errors.firstName : ''}
                    errorStyle={styles.errorText}
                    inputStyle={[styles.text, {fontSize: fontscale(18)}]}
                    label="First Name"
                    labelStyle={styles.text}
                    onBlur={() => setFieldTouched('firstName')}
                    onChangeText={handleChange('firstName')}
                    textContentType="givenName"
                    onSubmitEditing={() => {
                      this.lastName.focus();
                    }}
                  />
                  <Input
                    autoCapitalize="words"
                    errorMessage={touched.lastName ? errors.lastName : ''}
                    errorStyle={styles.errorText}
                    inputStyle={[styles.text, {fontSize: fontscale(18)}]}
                    label="Last Name"
                    labelStyle={styles.text}
                    onBlur={() => setFieldTouched('lastName')}
                    onChangeText={handleChange('lastName')}
                    textContentType="familyName"
                    onSubmitEditing={() => {
                      this.email.focus();
                    }}
                    ref={(input) => {
                      this.lastName = input;
                    }}
                  />
                  <Input
                    autoCapitalize="none"
                    errorMessage={touched.email ? errors.email : ''}
                    errorStyle={styles.errorText}
                    inputStyle={[styles.text, {fontSize: fontscale(18)}]}
                    label="Email"
                    labelStyle={styles.text}
                    onBlur={() => setFieldTouched('email')}
                    onChangeText={handleChange('email')}
                    textContentType="emailAddress"
                    onSubmitEditing={() => {
                      this.password.focus();
                    }}
                    ref={(input) => {
                      this.email = input;
                    }}
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
                    onSubmitEditing={() => {
                      this.confirmPassword.focus();
                    }}
                    ref={(input) => {
                      this.password = input;
                    }}
                  />
                  <Input
                    autoCapitalize="none"
                    errorMessage={
                      touched.confirmPassword ? errors.confirmPassword : ''
                    }
                    errorStyle={styles.errorText}
                    inputStyle={[styles.text, styles.titleText]}
                    label="Confirm Password"
                    labelStyle={styles.text}
                    onBlur={() => setFieldTouched('confirmPassword')}
                    onChangeText={handleChange('confirmPassword')}
                    secureTextEntry
                    ref={(input) => {
                      this.confirmPassword = input;
                    }}
                  />
                  <Button
                    title={'Sign Up'}
                    buttonStyle={styles.submitButton}
                    onPress={handleSubmit}
                    titleStyle={[
                      styles.text,
                      {color: 'white', fontSize: fontscale(20)},
                    ]}
                  />
                </>
              )}
            </Formik>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

function getEventHandlers(setLoading, dispatch) {
  const _onPressBack = () => {
    navigation.goBack();
  };
  const _onRegister = async (data) => {
    setLoading(true);
    await dispatch(RegisterRequest(data));
    setLoading(false);
  };
  return {
    _onRegister,
    _onPressBack,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#61c0ff',
  },
  errorText: {
    fontSize: fontscale(17),
    color: 'red',
  },
  submitButton: {
    backgroundColor: '#61c0ff',
    borderRadius: widthPercentageToDP(2),
    width: widthPercentageToDP(77),
    height: heightPercentageToDP(6.5),
    marginEnd: widthPercentageToDP(2),
    marginTop: heightPercentageToDP(1),
    marginBottom: heightPercentageToDP(1),
  },
  text: {
    fontWeight: '300',
    fontSize: fontscale(17),
    color: 'black',
  },
  titleText: {fontSize: fontscale(17)},
});

export default SignUpScreen;
