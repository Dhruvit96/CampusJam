import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar, Header, Text} from 'react-native-elements';
import AppScreen from '../../components/AppScreen';
import TabComponent from '../../components/ProfileTab';
import PostButton from '../../components/PostButton';
import useSelector from '../../store';

const Profile = () => {
  const userState = useSelector((state) => state.user.userInfo);
  return (
    <AppScreen>
      <Header
        backgroundColor="transparent"
        placement="center"
        leftComponent={{icon: 'arrow-back', color: '#000'}}
        centerComponent={{
          text: 'My Profile',
          style: {color: '#000', fontSize: 24},
        }}
        rightComponent={{icon: 'settings', color: '#000'}}
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
          source={{uri: userState.avatar}}
          title={userState.initials}
          titleStyle={{fontSize: 55}}
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
            marginTop: 30,
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
            <TabComponent name="Posts" count={userState.posts.length()} />
            <TabComponent
              name="Followers"
              count={userState.followers.length()}
            />
            <TabComponent
              name="Following"
              count={userState.following.length()}
            />
          </View>
        </View>
      </View>
      {/*<Divider
        style={{
          backgroundColor: '#000',
        }}
      />*/}
      <View style={styles.postContainer}>
        <PostButton
          title="Edit Profile"
          iconName="edit"
          type="feather"
          size={24}
          padding={50}
        />
        <PostButton title="Add Post" iconName="add" size={24} padding={50} />
        <PostButton
          title="Shared Posts"
          iconName="bookmark-outline"
          size={24}
          padding={50}
        />
        <PostButton
          title="Liked Posts"
          iconName="favorite-outline"
          size={24}
          padding={30}
        />
      </View>
    </AppScreen>
  );
};

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
    marginBottom: 40,
  },
  profileContainer: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: 'grey',
    padding: 2,
    fontWeight: 'normal',
    alignSelf: 'center',
  },
});

export default Profile;
