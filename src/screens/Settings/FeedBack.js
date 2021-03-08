import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  StatusBar,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import {Header, AirbnbRating, Text, Input, Button} from 'react-native-elements';
import {
  fontscale,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../constants';
import {useSelector} from '../../store';
import {navigation} from '../../navigations/RootNavigation';
import firestore from '@react-native-firebase/firestore';

const FeedBack = () => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const uid = useSelector((state) => state.user.userInfo.uid);
  const _onChangeRating = (ratings) => {
    setRating(ratings);
  };
  const _onChangeComment = (text) => {
    setComment(text);
  };
  const _onPressSubmit = async () => {
    setLoading(true);
    try {
      await firestore().collection('feedback').add({
        rating: rating,
        comment: comment,
        uid: uid,
      });
      navigation.goBack();
    } catch (e) {
      console.warn(e);
      Alert.alert('Error', 'Can not submit feedback.');
    }
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Header
        backgroundColor="white"
        placement="center"
        leftComponent={{
          icon: 'arrow-back',
          color: '#000',
          size: fontscale(27),
          onPress: () => navigation.goBack(),
        }}
        centerComponent={{
          text: 'App Feedback',
          style: {color: '#000', fontSize: fontscale(24)},
        }}
      />
      <ScrollView
        contentContainerStyle={{flexGrow: 1, backgroundColor: 'white'}}>
        <View>
          <Image
            source={require('../../assets/feedback.png')}
            style={styles.image}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.heading}>Please rate your experience</Text>
          <AirbnbRating
            count={5}
            showRating={false}
            onFinishRating={_onChangeRating}
            defaultRating={5}
            size={fontscale(30)}
            selectedColor="#61c0ff"
          />
          <Text style={styles.heading}>Comments</Text>
          <View style={styles.inputContainer}>
            <Input multiline onChangeText={_onChangeComment} />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Submit"
              disabled={comment.length == 0}
              onPress={_onPressSubmit}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: heightPercentageToDP(2),
  },
  container: {
    margin: widthPercentageToDP(3),
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
  heading: {
    fontSize: fontscale(20),
    marginTop: heightPercentageToDP(1),
    marginBottom: heightPercentageToDP(1),
    marginStart: widthPercentageToDP(1),
  },
  image: {
    width: widthPercentageToDP(65),
    height: widthPercentageToDP(60),
    alignSelf: 'center',
  },
  inputContainer: {
    height: heightPercentageToDP(20),
    paddingBottom: heightPercentageToDP(5),
    borderWidth: 0.4,
  },
});

export default FeedBack;
