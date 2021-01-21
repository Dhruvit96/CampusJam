import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Button, Icon, Input, Text} from 'react-native-elements';

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
  return (
    <ScrollView>
      <View style={styles.container}>
        <View
          style={{
            width: '100%',
            height: 80,
            flexDirection: 'row',
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-start',
              marginStart: 20,
            }}>
            <TouchableOpacity>
              <Icon name="arrow-back" size={34} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <TouchableOpacity>
              <Text style={{alignSelf: 'center', fontSize: 40, color: '#fff'}}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}} />
        </View>
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'white',
            borderTopLeftRadius: 75,
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 350,
              marginTop: 50,
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
              onSubmit={(values) => {
                console.log(values);
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
                    autoCapitalize="words"
                    errorMessage={touched.firstName ? errors.firstName : ''}
                    errorStyle={styles.errorText}
                    inputStyle={[styles.text, {fontSize: 20}]}
                    label="First Name"
                    labelStyle={styles.text}
                    onBlur={() => setFieldTouched('firstName')}
                    onChangeText={handleChange('firstName')}
                    textContentType="givenName"
                    //onSubmitEditing={() => {
                    //  this.lastName.focus();
                    //}}
                  />
                  <Input
                    autoCapitalize="words"
                    errorMessage={touched.lastName ? errors.lastName : ''}
                    errorStyle={styles.errorText}
                    inputStyle={[styles.text, {fontSize: 20}]}
                    label="Last Name"
                    labelStyle={styles.text}
                    onBlur={() => setFieldTouched('lastName')}
                    onChangeText={handleChange('lastName')}
                    textContentType="familyName"
                    //onSubmitEditing={() => {
                    //  this.email.focus();
                    //}}
                    //ref={(input) => {
                    //  this.firstName = input;
                    //}}
                  />
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
                    //ref={(input) => {
                    //  this.email = input;
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
                    //onSubmitEditing={() => {
                    //  this.confirmPassword.focus();
                    //}}
                    //ref={(input) => {
                    //  this.password = input;
                    //}}
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
                    //ref={(input) => {
                    //  this.confirmPassword = input;
                    //}}
                  />
                  <Button
                    title={'Sign Up'}
                    buttonStyle={styles.submitButton}
                    onPress={handleSubmit}
                    titleStyle={[styles.text, {color: 'white', fontSize: 24}]}
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
  submitButton: {
    backgroundColor: '#61c0ff',
    width: 330,
    height: 50,
    marginEnd: 10,
    marginTop: 18,
  },
  text: {
    fontWeight: '300',
    fontSize: 20,
    color: 'black',
  },
  titleText: {fontSize: 20},
});

export default SignUpScreen;
