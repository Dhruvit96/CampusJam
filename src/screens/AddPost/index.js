import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Avatar, Button, Header, Icon, Text} from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
import * as ImagePicker from 'expo-image-picker';
import {useSelector} from '../../store';
import {TextInput} from 'react-native';
import {useDispatch} from 'react-redux';
import {CreatePostRequest, UpdatePostRequest} from '../../actions/postActions';
import {navigation} from '../../navigations/RootNavigation';

const AddPost = ({route}) => {
  const user = useSelector((state) => state.user.userInfo);
  const loading = useSelector((state) => state.user.loading);
  let post = useSelector((state) => state.user.extraInfo.posts);
  const [text, setText] = useState('');
  const [image, setImage] = useState();
  const [scale, setScale] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    if (typeof route.params !== 'undefined') {
      post = post.filter((x) => x.postId === route.params.postId)[0];
      setImage(post.image);
      setText(post.text);
      setScale(post.scale);
    }
  }, []);
  const {
    _onChangeText,
    _onPressBack,
    _onPressCamera,
    _onPressImage,
    _onPressPost,
    _onPressRemove,
    _onPressUpdate,
  } = getEventHandlers(
    dispatch,
    image,
    route.params?.postId,
    setImage,
    setScale,
    setText,
    text,
  );
  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Header
          backgroundColor="transparent"
          placement="center"
          leftComponent={{
            icon: 'arrow-back',
            color: '#000',
            size: fontscale(27),
            onPress: _onPressBack,
          }}
          centerComponent={{
            text: route.params ? 'Edit Post' : 'Create Post',
            style: {color: '#000', fontSize: fontscale(24)},
          }}
        />
        <ScrollView>
          <View style={styles.row}>
            <View>
              <Avatar
                rounded
                size={fontscale(50)}
                source={user.avatar ? {uri: user.avatar} : null}
                title={!user.avatar ? user.initials : null}
                titleStyle={{fontSize: fontscale(17)}}
                containerStyle={{backgroundColor: '#523'}}
              />
            </View>
            <View style={{marginStart: widthPercentageToDP(3)}}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.text}>{user.id}</Text>
            </View>
            <View style={styles.rightComponent}>
              <Button
                title={route.params ? 'Update' : 'Post'}
                buttonStyle={{
                  width: widthPercentageToDP(24),
                  backgroundColor: '#61c0ff',
                  borderRadius: widthPercentageToDP(2),
                }}
                onPress={route.params ? _onPressUpdate : _onPressPost}
                loading={loading}
                disabled={text.length == 0 && typeof image === 'undefined'}
              />
            </View>
          </View>
          <TextInput
            style={[{padding: widthPercentageToDP(3)}, styles.name]}
            placeholder="Write something here"
            multiline
            value={text}
            onChangeText={_onChangeText}
          />
          {image ? (
            <Image
              source={{uri: image}}
              style={{
                width: widthPercentageToDP(96),
                height: scale * widthPercentageToDP(96),
                resizeMode: 'cover',
                marginTop: heightPercentageToDP(1),
                marginBottom: heightPercentageToDP(1),
                borderRadius: widthPercentageToDP(3),
                alignSelf: 'center',
              }}
            />
          ) : null}
        </ScrollView>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          padding: widthPercentageToDP(3),
          paddingStart: widthPercentageToDP(6),
        }}>
        <TouchableOpacity onPress={_onPressImage} style={styles.iconContainer}>
          <FontAwesome name="picture-o" size={fontscale(20)} />
        </TouchableOpacity>
        <TouchableOpacity onPress={_onPressCamera} style={styles.iconContainer}>
          <Feather name="camera" size={fontscale(20)} />
        </TouchableOpacity>
        {image ? (
          <TouchableOpacity
            onPress={_onPressRemove}
            style={styles.iconContainer}>
            <Feather name="x" size={fontscale(20)} />
          </TouchableOpacity>
        ) : null}
      </View>
    </>
  );
};

function getEventHandlers(
  dispatch,
  image,
  postId,
  setImage,
  setScale,
  setText,
  text,
) {
  const _onChangeText = (text) => setText(text);
  const _onPressBack = () => navigation.goBack();
  const _onPressCamera = async () => {
    const {status} = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera and storage permissions to make this work!');
    } else {
      try {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.6,
          allowsMultipleSelection: false,
        });
        if (!result.cancelled) {
          setImage(result.uri);
          setScale(result.height / result.width);
        }
      } catch (e) {
        Alert.alert('Error', 'Please select another Image');
      }
    }
  };
  const _onPressImage = async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need storage permissions to make this work!');
    } else {
      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.6,
          allowsMultipleSelection: false,
        });
        if (!result.cancelled) {
          setImage(result.uri);
          setScale(result.height / result.width);
        }
      } catch (e) {
        Alert.alert('Error', 'Please select another Image');
      }
    }
  };
  const _onPressPost = async () => {
    await dispatch(CreatePostRequest({image: image, text: text}));
    navigation.goBack();
  };
  const _onPressUpdate = async () => {
    await dispatch(UpdatePostRequest({postId, image, text}));
    navigation.goBack();
  };
  const _onPressRemove = () => {
    setImage();
  };
  return {
    _onChangeText,
    _onPressBack,
    _onPressCamera,
    _onPressImage,
    _onPressPost,
    _onPressRemove,
    _onPressUpdate,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  iconContainer: {
    marginEnd: widthPercentageToDP(4),
    borderRadius: widthPercentageToDP(10),
    borderWidth: widthPercentageToDP(0.6),
    padding: widthPercentageToDP(2),
  },
  name: {
    fontSize: fontscale(16),
  },
  row: {
    flexDirection: 'row',
    padding: widthPercentageToDP(3),
    paddingTop: 0,
    alignItems: 'center',
  },
  rightComponent: {
    position: 'absolute',
    end: widthPercentageToDP(7),
    alignSelf: 'center',
  },
  text: {
    fontSize: fontscale(13),
  },
});
export default AddPost;
