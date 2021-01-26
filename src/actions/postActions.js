import {
  postActionTypes,
  notificationTypes,
  seenTypes,
  uploadPhotoAsync,
  FieldValue,
  TimeStamp,
} from '../constants';
import firestore from '@react-native-firebase/firestore';
import {store} from '../store';
import {UpdateExtraInfoRequest} from '../actions/userActions';
import {CreateNotificationRequest} from '../actions/notificationActions';
import * as ImageManipulator from 'expo-image-manipulator';

export const CreatePostRequest = (postData) => {
  return async (dispatch) => {
    try {
      let currentUser = {...store.getState().user.userInfo};
      let imageUri = await ImageManipulator.manipulateAsync(
        image,
        [{resize: {width: 580}}],
        {format: 'jpeg'},
      );
      let scale = imageUri.height / imageUri.width;
      let time = TimeStamp.now();
      let imageUri = await uploadPhotoAsync(
        imageUri.uri,
        `photos/${currentUser.uid}/${time}`,
      );
      let data = {
        image: imageUri,
        scale: scale,
        text: text,
        time: time,
        uid: currentUser.uid,
        likedBy: [],
        comments: [],
      };
      await firestore()
        .collection('posts')
        .add({...data})
        .then(async (ref) => {
          await firestore()
            .collection('user')
            .doc(currentUser.uid)
            .update({
              posts: FieldValue.arrayUnion(ref.id),
            });
          UpdateExtraInfoRequest(ref.id);
        });
      UpdatePostData(data);
    } catch (e) {
      dispatch(CreatePostFailure());
    }
  };
};
