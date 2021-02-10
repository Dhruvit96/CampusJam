import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {StatusBar, StyleSheet, View} from 'react-native';
import {Button, Input, Icon, Text} from 'react-native-elements';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {navigation} from '../../navigations/RootNavigation';
import Loading from '../../components/Loading';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
import {ChangePasswordRequest} from '../../actions/userActions';

const validationSchema = Yup.object().shape({
  password: Yup.string().required().min(6).label('Password'),
  newPassword: Yup.string()
    .required()
    .min(6)
    .notOneOf(
      [Yup.ref('password'), null],
      "New password and password can't be same",
    )
    .label('New password'),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .label('Confirm Password'),
});

const ChangePassword = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {_onPressChange, _onPressBack} = getEventHandlers(setLoading, dispatch);
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Loading isVisible={loading} />
      <View
        style={{
          width: '100%',
          height: heightPercentageToDP(12),
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <TouchableOpacity onPress={_onPressBack}>
            <Icon name="arrow-back" size={fontscale(30)} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
      <Text
        h1
        h1Style={{
          color: '#61c0ff',
          fontSize: fontscale(32),
          fontWeight: '200',
          marginTop: heightPercentageToDP(6),
        }}>
        Change Password
      </Text>
      <View
        style={{
          width: widthPercentageToDP(85),
          marginTop: heightPercentageToDP(4),
          alignItems: 'flex-start',
        }}>
        <Formik
          initialValues={{password: '', newPassword: '', confirmPassword: ''}}
          validationSchema={validationSchema}
          onSubmit={_onPressChange}>
          {({errors, handleChange, handleSubmit, setFieldTouched, touched}) => (
            <>
              <Input
                autoCapitalize="none"
                errorMessage={touched.password ? errors.password : ''}
                errorStyle={styles.errorText}
                inputStyle={[styles.text, {fontSize: fontscale(18)}]}
                label="Password"
                labelStyle={styles.text}
                onBlur={() => setFieldTouched('password')}
                onChangeText={handleChange('password')}
                onSubmitEditing={() => {
                  this.newPassword.focus();
                }}
                secureTextEntry
                textContentType="password"
              />
              <Input
                autoCapitalize="none"
                errorMessage={touched.newPassword ? errors.newPassword : ''}
                errorStyle={styles.errorText}
                inputStyle={[styles.text, {fontSize: fontscale(18)}]}
                label="New password"
                labelStyle={styles.text}
                onBlur={() => setFieldTouched('newPassword')}
                onChangeText={handleChange('newPassword')}
                onSubmitEditing={() => {
                  this.confirmPassword.focus();
                }}
                ref={(input) => (this.newPassword = input)}
                secureTextEntry
                textContentType="newPassword"
              />
              <Input
                autoCapitalize="none"
                errorMessage={
                  touched.confirmPassword ? errors.confirmPassword : ''
                }
                errorStyle={styles.errorText}
                inputStyle={[styles.text, {fontSize: fontscale(18)}]}
                label="Confirm password"
                labelStyle={styles.text}
                onBlur={() => setFieldTouched('confirmPassword')}
                onChangeText={handleChange('confirmPassword')}
                ref={(input) => (this.confirmPassword = input)}
                secureTextEntry
              />
              <View
                style={{alignItems: 'center', width: widthPercentageToDP(90)}}>
                <Button
                  title={'Change password'}
                  onPress={handleSubmit}
                  buttonStyle={styles.button}
                  titleStyle={[
                    styles.text,
                    {color: 'white', fontSize: fontscale(20)},
                  ]}
                />
              </View>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
};

function getEventHandlers(setLoading, dispatch) {
  const _onPressBack = () => {
    navigation.goBack();
  };
  const _onPressChange = async ({password, newPassword}) => {
    setLoading(true);
    await dispatch(ChangePasswordRequest({password, newPassword}));
    setLoading(false);
  };
  return {
    _onPressChange,
    _onPressBack,
  };
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#61c0ff',
    borderRadius: widthPercentageToDP(2),
    width: widthPercentageToDP(70),
    height: heightPercentageToDP(6.5),
    marginEnd: widthPercentageToDP(2),
    marginTop: heightPercentageToDP(4),
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingStart: widthPercentageToDP(8),
  },
  errorText: {
    fontSize: fontscale(17),
    color: 'red',
  },
  text: {
    fontWeight: '300',
    fontSize: fontscale(18),
    color: 'black',
  },
});

export default ChangePassword;
