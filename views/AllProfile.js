import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator, View} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text, ListItem, Avatar, Image} from 'react-native-elements';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl, appIdentifier} from '../utils/variables';
import {ScrollView} from 'react-native-gesture-handler';

// AllProfiles is used to show other users profiles. It uses "guest" instead of "user"
const AllProfile = ({navigation}) => {
  const [fetchBio, setFetchBio] = useState('');
  const {isLoggedIn, setIsLoggedIn, guest} = useContext(MainContext);
  const [avatar, setAvatar] = useState('http://placekitten.com/640'); // Placeholder for accounts without profile picture
  const {getFilesByTag} = useTag();
  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
    if (!isLoggedIn) {
      // this is to make sure isLoggedIn has changed, will be removed later
      navigation.navigate('Login');
    }
  };

  const getBio = async () => {
    let realEmail;
    let bio;

    const fullEmail = guest.email;
    if (fullEmail.includes(']')) {
      const fullEmailWithBio = JSON.parse(fullEmail);
      realEmail = fullEmailWithBio[0];
      // console.log('real email here: ' + realEmail);
      bio = fullEmailWithBio[1];
      // console.log('bio here: ' + bio);
    } else {
      bio = '';
    }
    setFetchBio(bio);
  };

  const fetchAvatar = async () => {
    try {
      const avatarList = await getFilesByTag(appIdentifier + guest.user_id);
      if (avatarList.length > 0) {
        setAvatar(uploadsUrl + avatarList.pop().filename);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchAvatar();
    getBio();
  }, []);

  return (
    <ScrollView>
      <View style={styles.loginArea}>
        {isLoggedIn ? (
          <Text style={styles.loginText} onPress={logout}>
            Logout
          </Text>
        ) : (
          <Text
            style={styles.loginText}
            onPress={() => navigation.navigate('Login')}
          >
            Login/Register
          </Text>
        )}
      </View>
      <View style={styles.view}>
        <Image
          source={{uri: avatar}}
          style={styles.image}
          PlaceholderContent={<ActivityIndicator />}
        />
      </View>
      <View style={styles.view}>
        <Text h1>{guest.username}</Text>
      </View>
      <View style={styles.view}>
        <Text>{'Biography: '}</Text>
        <Text>{fetchBio}</Text>
      </View>
      <ListItem bottomDivider onPress={() => navigation.push('GuestFiles')}>
        <Avatar icon={{name: 'perm-media', color: 'black'}} />
        <ListItem.Content>
          <ListItem.Title>All users recipes</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    marginTop: 16,
    width: '40%',
    height: undefined,
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: 150,
    overflow: 'hidden',
    flex: 1,
  },
  loginArea: {
    height: 30,
    backgroundColor: '#97caca',
  },
  loginText: {
    color: '#000',
    textAlign: 'right',
    paddingRight: 15,
    paddingBottom: 5,
    paddingTop: 5,
  },

  view: {
    alignItems: 'center',
    flex: 1,
  },
});

AllProfile.propTypes = {
  navigation: PropTypes.object,
};

export default AllProfile;
