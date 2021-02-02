import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {StyleSheet, View} from 'react-native';
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
import {passwordResetRequest} from '../../actions/userActions';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
});

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {_onPressSend, _onPressBack} = getEventHandlers(setLoading, dispatch);
  return (
    <View style={styles.container}>
      <Loading isVisible={loading} />
      <View
        style={{
          width: '100%',
          height: heightPercentageToDP(10),
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
          marginTop: heightPercentageToDP(11),
        }}>
        Forgot Password?
      </Text>
      <Text
        h1
        h1Style={{
          width: widthPercentageToDP(86),
          fontSize: fontscale(15.6),
          fontWeight: '200',
          marginTop: heightPercentageToDP(6),
          alignSelf: 'flex-start',
        }}>
        Please, enter your email, You will receive a link to create a new
        password via email.
      </Text>
      <View
        style={{
          width: widthPercentageToDP(85),
          marginTop: heightPercentageToDP(4),
          alignItems: 'flex-start',
        }}>
        <Formik
          initialValues={{email: ''}}
          validationSchema={validationSchema}
          onSubmit={_onPressSend}>
          {({errors, handleChange, handleSubmit, setFieldTouched, touched}) => (
            <>
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
              />
              <View
                style={{alignItems: 'center', width: widthPercentageToDP(90)}}>
                <Button
                  title={'Send'}
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
  const _onPressSend = async ({email}) => {
    setLoading(true);
    await dispatch(passwordResetRequest(email));
    setLoading(false);
  };
  return {
    _onPressSend,
    _onPressBack,
  };
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#61c0ff',
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

export default ForgotPassword;
