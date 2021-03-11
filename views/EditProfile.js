import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Button, ToastAndroid,
} from 'react-native';
import PropTypes from 'prop-types';
import {Input, Image, Button, ThemeProvider} from 'react-native-elements';
import useUploadForm from '../hooks/UploadHooks';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {appIdentifier, uploadsUrl} from '../utils/variables';
import useSignUpForm from '../hooks/RegisterHooks';
import * as AlertIOS from 'react-native';

const EditProfile = ({navigation}) => {
  const [fetchBio, setFetchBio] = useState('');
  const [image, setImage] = useState(null);
  const [filetype, setFiletype] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const {updateUser, getUser} = useUser();
  const {upload} = useMedia();
  const [avatar, setAvatar] = useState('http://placekitten.com/640'); // Placeholder for accounts without profile picture
  const {
    inputs,
    handleInputChange,
    handleInputEnd,
    registerErrors,
  } = useSignUpForm();

  const {postTag} = useTag();
  const {update, setUpdate, user, setGetPicture, getPicture, setGetBioChange, getBioChange} = useContext(MainContext);
  const {update, setUpdate, user} = useContext(MainContext);
  const {isLoggedIn, setIsLoggedIn} = useContext(MainContext);
  const {theme} = useContext(MainContext);
  const {getFilesByTag} = useTag();

  const settingBio = async () => {
    let realEmail;
    const userToken = await AsyncStorage.getItem('userToken');
    const fullEmail = user.email;
    if (fullEmail.includes(']')) {
      const fullEmailWithBio = JSON.parse(fullEmail);
      realEmail = fullEmailWithBio[0];
    } else {
      realEmail = user.email;
    }
    const res = await updateUser(userToken, {
      email: JSON.stringify([realEmail, inputs.email]),
    });
    setGetBioChange(!getBioChange)
    notifyMessage("Bio changed")
  };

  const notifyMessage = (msg) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(msg);
    }
  };

  // Function for fetching the avatar and showing it on the view
  const fetchAvatar = async () => {
    try {
      const avatarList = await getFilesByTag(appIdentifier + user.user_id);
      if (avatarList.length > 0) {
        setAvatar(uploadsUrl + avatarList.pop().filename);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Function for fetching the bio and showing it on the view
  const getBio = async () => {
    let realEmail;
    let bio;
    const userToken = await AsyncStorage.getItem('userToken');
    const userInfo = await getUser(user.user_id, userToken);
    const fullEmail = userInfo.email;
    if (fullEmail.includes(']')) {
      const fullEmailWithBio = JSON.parse(fullEmail);
      realEmail = fullEmailWithBio[0];
      bio = fullEmailWithBio[1];
    } else {
      bio = '';
    }
    setFetchBio(bio);
  };

  const combinedFunction = () => {
    settingBio();
    getBio();
  };

  useEffect(() => {
    fetchAvatar();
    getBio();
  }, []);

  const doUpload = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const formData = new FormData();
    // add text to formData
    formData.append('description', 'profile picture');
    // add image to formData
    console.log("image here: " + image)
    const filename = image.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `${filetype}/${match[1]}` : filetype;
    if (type === 'image/jpg') type = 'image/jpeg';
    formData.append('file', {
      uri: image,
      name: filename,
      type: type,
    });
    try {
      setIsUploading(true);
      const resp = await upload(formData, userToken);
      console.log('response here: ' + resp);
      const tagResponse = await postTag(
        {
          file_id: resp,
          tag: appIdentifier + user.user_id,
        },
        userToken,
      );
      Alert.alert(
        'Upload',
        'File uploaded',
        [
          {
            text: 'Ok',
            onPress: () => {
              setUpdate(update + 1);
              navigation.navigate('EditProfile');
            },
          },
        ],
        {cancelable: false},
      );
      // const response = await deleteFile(getCurrentProfileFileId(), userToken);
    } catch (error) {
      Alert.alert('Upload', 'Failed');
      console.error(error);
    } finally {
      setIsUploading(false);
      console.log("here is the image" + image)
      setAvatar(image)
      setGetPicture(!getPicture)
    }
  };

  const pickImage = async (library) => {
    let result = null;
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    };
    if (library) {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      result = await ImagePicker.launchCameraAsync(options);
    }

    if (!result.cancelled) {
      setFiletype(result.type);
      setImage(result.uri);
    }
  };

  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="position" enabled>
        <View style={styles.container}>
          <View style={styles.imageArea}>
            {image === null ? (
              <Image
                style={styles.image}
                source={{uri: avatar}}
                onPress={pickImage}
              />
            ) : (
              <Image
                style={styles.image}
                source={{uri: image}}
                onPress={pickImage}
              />
            )}
          </View>
          <View style={styles.bioTextArea}>
            <Input
              defaultValue={fetchBio}
              autoCapitalize="none"
              placeholder="New bio goes here"
              onChangeText={(txt) => handleInputChange('email', txt)}
              onEndEditing={(event) =>
                handleInputEnd('email', event.nativeEvent.text)
              }
              errorMessage={registerErrors.email}
            />
          </View>
        </View>
        <View style={styles.buttonArea}>
          <ThemeProvider theme={theme}>
            <Button
              style={styles.buttons}
              title="Choose from library"
              onPress={() => pickImage(true)}
            />
            <Button title="Use camera" onPress={() => pickImage(false)} />
            {isUploading && <ActivityIndicator size="large" color="#0000ff" />}
            <Button title="Save image" onPress={doUpload} />
            <Button title="Save bio change" onPress={combinedFunction} />
          </ThemeProvider>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    flexDirection: 'column',
    height: 320,
  },
  imageArea: {
    height: 150,
    alignItems: 'center',
  },
  bioTextArea: {
    marginTop: 50,
    height: 150,
  },
  buttonArea: {
    padding: 20,
    height: 230,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  image: {
    marginTop: 16,
    width: '40%',
    height: undefined,
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: 150,
    overflow: 'hidden',
    alignItems: 'center',
  },
  buttons: {
    width: 50,
  },
});

EditProfile.propTypes = {
  navigation: PropTypes.object,
};

export default EditProfile;
