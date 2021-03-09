import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator, View} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text, ListItem, Avatar, Image} from 'react-native-elements';
import {useTag, useUser} from '../hooks/ApiHooks';
import {uploadsUrl, appIdentifier} from '../utils/variables';
import {ScrollView} from 'react-native-gesture-handler';
import useSignUpForm from '../hooks/RegisterHooks';

const AllProfile = ({navigation}) => {
  const [fetchBio, setFetchBio] = useState('');
  const {updateUser, getUser, checkToken} = useUser();

  const {
    inputs,
    handleInputChange,
    handleInputEnd,
    checkUserAvailable,
    registerErrors,
    validateOnSend,
  } = useSignUpForm();
  const [filetype, setFiletype] = useState('');
  const {isLoggedIn, setIsLoggedIn, user, guest, setGuest} = useContext(MainContext);
  const [avatar, setAvatar] = useState('http://placekitten.com/640'); // Placeholder for accounts without profile picture
  const {getFilesByTag, postTag} = useTag();
  const [loading, setLoading] = useState(false);
  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
    if (!isLoggedIn) {
      // this is to make sure isLoggedIn has changed, will be removed later
      navigation.navigate('Login');
    }
  };
  // const {handleInputChange, inputs, uploadErrors, reset} = useUploadForm();

  // let guest = {
  //   email: '["guest@email","bio text"]',
  //   full_name: 'Guest',
  //   user_id: 0,
  //   username: 'guest',
  // };

  // console.log('AllProfile guest TEST my: ', guest);

  // console.log('AllProfile guest TEST user: ', guest);

  // const UserIdfromListItem = async () => {
  //   setLoading(true);
  //   try {
  //     const userId = await AsyncStorage.getItem('userId');
  //     const userIdInfo = JSON.parse(userId);
  //     setGuest(userIdInfo);
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     console.error('user info error', error.message);
  //   }
  //   // console.log('AllProfile guest altered id: ', guest.email);
  // };

  const settingEmail = async () => {
    // const userToken = await AsyncStorage.getItem('userToken');
    // console.log('here are inputs: ' + JSON.stringify(inputs.username));
    const fullUsername = JSON.parse(guest.username);
    const realBio = fullUsername[1];

    // const res = await updateUser(userToken, {
    //   username: JSON.stringify([inputs.username, realBio]),
    // });
    // console.log("is this the thing that is undefined? " + res)
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

      const avatar = await getFilesByTag(appIdentifier + guest.user_id);
      // console.log('AllProfile fetchAvatar', guestUserId);
      setAvatar(uploadsUrl + avatar.pop().filename);
    } catch (error) {
      console.error(error.message);
    }
  };

  // const returnInfo = async () => {
  //   const userToken = await AsyncStorage.getItem('userToken');
  //   const userData = await checkToken(userToken);

  //   guest.username = userData.username;

    // console.log('AllProfile Return original id: ', guest);
  // };

  // const removeInfo = async () => {
  //   await AsyncStorage.removeItem('userId');

  // };

  useEffect(() => {
    // UserIdfromListItem();
    fetchAvatar();
    getBio();
    // returnInfo();
    // removeInfo();
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
