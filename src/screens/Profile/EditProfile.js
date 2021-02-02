import React, {useState} from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar, Button, Header, Input, Text} from 'react-native-elements';
import {Formik} from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import AppScreen from '../../components/AppScreen';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
import {useSelector} from '../../store';
import {useDispatch} from 'react-redux';
import Loading from '../../components/Loading';
import {navigation} from '../../navigations/RootNavigation';
import {UpdateUserInfoRequest} from '../../actions/userActions';

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
});

const EditProfile = () => {
  const dispatch = useDispatch();
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
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Loading isVisible={loading} />
        <Header
          backgroundColor="transparent"
          placement="center"
          containerStyle={{
            marginTop: Platform.OS == 'android' ? -StatusBar.currentHeight : 0,
          }}
          leftComponent={{
            icon: 'arrow-back',
            color: '#000',
            size: fontscale(25),
            onPress: _onPressBack,
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
            source={avatar ? {uri: avatar} : null}
            title={!avatar ? userState.initials : null}
            titleStyle={{fontSize: fontscale(50)}}
            containerStyle={{
              backgroundColor: '#523',
              margin: widthPercentageToDP(6),
            }}
          />
          <TouchableOpacity onPress={_onPressChangeAvatar}>
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
              initialValues={{name: userState.name, bio: userState.bio}}
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
                    onBlur={() => setFieldTouched('name')}
                    onChangeText={handleChange('name')}
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
      </View>
    </AppScreen>
  );
};

function getEventHandlers(dispatch, setLoading, setAvatar) {
  const _onPressBack = () => {
    navigation.goBack();
  };
  const _onPressChangeAvatar = async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.cancelled) {
        setAvatar(result.uri);
      }
    }
  };
  const _onPressUpdate = async (data) => {
    setLoading(true);
    await dispatch(UpdateUserInfoRequest(data));
    setLoading(false);
    _onPressBack();
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
