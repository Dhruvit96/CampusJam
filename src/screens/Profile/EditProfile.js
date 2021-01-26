import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Avatar, Button, Header, Input, Text} from 'react-native-elements';
import {Formik} from 'formik';
import * as Yup from 'yup';
import AppScreen from '../../components/AppScreen';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
import {useSelector} from '../../store';
import Loading from '../../components/Loading';
import ImagePicker from 'react-native-image-crop-picker';
import {navigation} from '../../navigations/RootNavigation';
import {date} from 'yup/lib/locale';
import {UpdateUserInfoRequest} from '../../actions/userActions';

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
});

const EditProfile = () => {
  const userState = useSelector((state) => state.user.userInfo);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(userState.avatar);
  const {_onPressUpdate, _onPressBack, _onPressChangeAvatar} = getEventHandlers(
    dispatch,
    setLoading,
    setAvatar,
  );
  return (
    <AppScreen>
      <Loading isVisible={loading} />
      <Header
        backgroundColor="transparent"
        style={styles.header}
        placement="center"
        leftComponent={{
          icon: 'arrow-back',
          color: '#000',
          size: fontscale(25),
          onPress: () => _onPressBack,
        }}
        centerComponent={{
          text: 'Edit Profile',
          style: {color: '#000', fontSize: fontscale(22)},
        }}
      />
      <View style={styles.container}>
        <Avatar
          rounded
          size={fontscale(124)}
          title={userState.initials}
          source={avatar ? {uri: userState.avatar} : null}
          titleStyle={{fontSize: fontscale(50)}}
          containerStyle={{
            backgroundColor: '#523',
            margin: widthPercentageToDP(6),
          }}
        />
        <TouchableOpacity onPress={() => _onPressChangeAvatar()}>
          <Text h4 h4Style={[styles.text, {color: 'grey'}]}>
            Change Photo
          </Text>
        </TouchableOpacity>
        <View
          style={{
            width: widthPercentageToDP(82),
            marginTop: heightPercentageToDP(4),
          }}>
          <Formik
            initialValues={{name: '', bio: ''}}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              _onPressUpdate({...values, avatar});
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
                  errorMessage={touched.name ? errors.name : ''}
                  errorStyle={styles.errorText}
                  inputStyle={[styles.text, {fontSize: fontscale(18)}]}
                  label="Name"
                  labelStyle={styles.text}
                  onBlur={() => setFieldTouched('email')}
                  onChangeText={handleChange('email')}
                  textContentType={'name'}
                  defaultValue={userState.name}
                />
                <Input
                  label="Bio"
                  labelStyle={styles.text}
                  inputStyle={[styles.text, {fontSize: fontscale(18)}]}
                  onChangeText={handleChange('bio')}
                  placeholder={'Enter your bio.'}
                  defaultValue={userState.bio}
                />
                <Button
                  title={'Update'}
                  buttonStyle={{
                    width: widthPercentageToDP(48),
                    marginStart: widthPercentageToDP(18),
                    backgroundColor: '#61c0ff',
                  }}
                  onPress={handleSubmit}
                />
              </>
            )}
          </Formik>
        </View>
      </View>
    </AppScreen>
  );
};

function getEventHandlers(dispatch, setLoading, setAvatar) {
  const _onPressBack = () => {
    navigation.goBack();
  };
  const _onPressChangeAvatar = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then((image) => {
        setAvatar(image.path);
      })
      .catch((error) => console.log(error));
  };
  const _onPressUpdate = async (data) => {
    setLoading(true);
    await dispatch(UpdateUserInfoRequest(data));
    setLoading(false);
  };
  return {
    _onPressBack,
    _onPressUpdate,
    _onPressChangeAvatar,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  errorText: {
    fontSize: fontscale(17),
    color: 'red',
  },
  text: {
    fontWeight: '300',
    fontSize: fontscale(19),
    color: 'black',
  },
});

export default EditProfile;
