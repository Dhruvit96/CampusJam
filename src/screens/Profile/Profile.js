import React, {useEffect, useState} from 'react';
import {RefreshControl, StyleSheet, View} from 'react-native';
import {Avatar, Header, Text} from 'react-native-elements';
import AppScreen from '../../components/AppScreen';
import TabComponent from '../../components/ProfileTab';
import PostButton from '../../components/PostButton';
import {useSelector} from '../../store';
import {useDispatch} from 'react-redux';
import {fontscale, heightPercentageToDP} from '../../constants';
import {navigation} from '../../navigations/RootNavigation';
import {ScrollView} from 'react-native-gesture-handler';
import {FetchExtraInfoRequest} from '../../actions/userActions';

const Profile = () => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const {_onPressEditProfile, _onRefresh} = getEventHandlers(
    dispatch,
    setRefreshing,
  );
  useEffect(() => {
    _onRefresh();
  }, []);
  const userState = useSelector((state) => state.user.userInfo);
  const extraInfoState = useSelector((state) => state.user.extraInfo);
  return (
    <ScrollView
      contentContainerStyle={{flex: 1}}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={_onRefresh}
          progressViewOffset={heightPercentageToDP(10)}
        />
      }>
      <Header
        backgroundColor="transparent"
        placement="center"
        leftComponent={{
          icon: 'arrow-back',
          color: '#000',
          size: fontscale(24),
        }}
        centerComponent={{
          text: 'My Profile',
          style: {color: '#000', fontSize: fontscale(24)},
        }}
        rightComponent={{
          icon: 'settings',
          color: '#000',
          size: fontscale(24),
        }}
        /*() => {
          return (
            <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={{paddingEnd: 12}}>
            <Icon name="edit" style={{color: '#000'}} type="feather" />
            </TouchableOpacity>
            <TouchableOpacity>
            <Icon name="settings" style={{color: '#000'}} />
            </TouchableOpacity>
            </View>
            );
          }*/
      />
      <View style={styles.profileContainer}>
        <Avatar
          rounded
          size="xlarge"
          source={userState.avatar ? {uri: userState.avatar} : null}
          title={!userState.avatar ? userState.initials : null}
          titleStyle={{fontSize: fontscale(50)}}
          containerStyle={{backgroundColor: '#523', margin: 20}}
        />
        <Text h4 h4Style={{fontWeight: '300'}}>
          {userState.name + '-' + userState.id}
        </Text>
        <Text h4 h4Style={styles.text}>
          {userState.bio}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: heightPercentageToDP(3),
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
            <TabComponent name="Posts" count={extraInfoState.posts.length} />
            <TabComponent
              name="Followers"
              count={extraInfoState.followers.length}
            />
            <TabComponent name="Following" count={userState.following.length} />
          </View>
        </View>
      </View>
      <View style={styles.postContainer}>
        <PostButton
          title="Edit Profile"
          iconName="edit"
          type="feather"
          size={fontscale(20)}
          onPress={() => _onPressEditProfile()}
        />
        <PostButton title="Add Post" iconName="add" size={fontscale(22)} />
        <PostButton
          title="Shared Posts"
          iconName="bookmark-outline"
          size={fontscale(22)}
        />
        <PostButton
          title="Liked Posts"
          iconName="favorite-outline"
          size={fontscale(22)}
        />
      </View>
    </ScrollView>
  );
};

function getEventHandlers(dispatch, setRefreshing) {
  const _onPressEditProfile = () => {
    navigation.push('EditProfile');
  };
  const _onRefresh = async () => {
    setRefreshing(true);
    await dispatch(FetchExtraInfoRequest());
    setRefreshing(false);
  };
  return {
    _onPressEditProfile,
    _onRefresh,
  };
}

const styles = StyleSheet.create({
  child: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postContainer: {
    flex: 8,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  profileContainer: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: fontscale(19),
    color: 'grey',
    padding: 2,
    fontWeight: 'normal',
    alignSelf: 'center',
  },
});

export default Profile;
