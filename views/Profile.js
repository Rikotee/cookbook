import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Text,
  ListItem,
  Avatar,
  Image,
  Button,
  Input, Card,
} from 'react-native-elements';
import {useTag, useMedia, useUser} from '../hooks/ApiHooks';
import {uploadsUrl, appIdentifier} from '../utils/variables';
import {ScrollView} from 'react-native-gesture-handler';
import useUploadForm from '../hooks/UploadHooks';
import useSignUpForm from '../hooks/RegisterHooks';

const Profile = ({navigation}) => {
  const [fetchBio, setFetchBio] = useState('')
  const [fetchName, setFetchName] = useState('')
  const {updateUser} = useUser()
  const {
    inputs,
    handleInputChange,
    handleInputEnd,
    checkUserAvailable,
    registerErrors,
    validateOnSend,
  } = useSignUpForm();
  const [filetype, setFiletype] = useState('');
  // const [fetchBio, setFetchBio] = useState('');
  const {isLoggedIn, setIsLoggedIn, user} = useContext(MainContext);
  const {getFile, upload} = useMedia();
  const [avatar, setAvatar] = useState('http://placekitten.com/640'); // Placeholder for accounts without profile picture
  const {getFilesByTag, postTag} = useTag();
  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
    if (!isLoggedIn) {
      // this is to make sure isLoggedIn has changed, will be removed later
      navigation.navigate('Login');
    }
  };
  // const {handleInputChange, inputs, uploadErrors, reset} = useUploadForm();



  const settingUsername = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    console.log("here are inputs: " + JSON.stringify(inputs.username))
    const fullUsername = JSON.parse(user.username)
    const realBio = fullUsername[1]

    const res = await updateUser(userToken, {username: JSON.stringify([inputs.username, realBio])})
    // console.log("is this the thing that is undefined? " + res)
  }

  const getBio = () => {
    const bio = JSON.parse(user.username)
    setFetchBio(bio[1])
    setFetchName(bio[0])
    console.log(bio)
  }

  const fetchAvatar = async () => {
    try {
      const avatar = await getFilesByTag(appIdentifier + user.user_id);
      setAvatar(uploadsUrl + avatar.pop().filename);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchAvatar();
    getBio()
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
          PlaceholderContent={<ActivityIndicator/>}
        />
      </View>
      <View style={styles.view}>
        <Text h1>{fetchName}</Text>
      </View>
      <ListItem>
        <Avatar icon={{name: 'user', type: 'font-awesome', color: 'black'}}/>
        <Text>{fetchBio}</Text>
      </ListItem>
      <ListItem bottomDivider onPress={() => navigation.push('My Files')}>
        <Avatar icon={{name: 'perm-media', color: 'black'}}/>
        <ListItem.Content>
          <ListItem.Title>My Files</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron/>
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

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
