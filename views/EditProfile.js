import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView, StyleSheet, View,
} from 'react-native';
import PropTypes from 'prop-types';
import {Input, Text, Image, Button, Card} from 'react-native-elements';
import useUploadForm from '../hooks/UploadHooks';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {appIdentifier, uploadsUrl} from '../utils/variables';
import {Video} from 'expo-av';
import useSignUpForm from '../hooks/RegisterHooks';

const EditProfile = ({navigation}) => {
    const [fetchBio, setFetchBio] = useState('');
    const [image, setImage] = useState(null);
    const [filetype, setFiletype] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const {updateUser, getUser} = useUser();
    const {deleteFile, getFile, upload, updateFile} = useMedia();
    const [avatar, setAvatar] = useState('http://placekitten.com/640'); // Placeholder for accounts without profile picture
    const {
      inputs,
      handleInputChange,
      handleInputEnd,
      checkUserAvailable,
      registerErrors,
      validateOnSend,
    } = useSignUpForm();

    const {postTag} = useTag();
    const {update, setUpdate, user} = useContext(MainContext);
    const {isLoggedIn, setIsLoggedIn} = useContext(MainContext);
    const {getFilesByTag} = useTag();

    const {
      setInputs,
      uploadErrors,
    } = useUploadForm();

    const settingBio = async () => {
      let realEmail;
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('here are inputs: ' + JSON.stringify(inputs.email));
      const fullEmail = user.email;
      if (fullEmail.includes(']')) {
        const fullEmailWithBio = JSON.parse(fullEmail);
        realEmail = fullEmailWithBio[0];
        console.log(realEmail);
      } else {
        realEmail = user.email;
      }
      const res = await updateUser(userToken,
        {email: JSON.stringify([realEmail, inputs.email])});
    };

    const fetchAvatar = async () => {
      try {
        const avatar = await getFilesByTag(appIdentifier + user.user_id);
        setAvatar(uploadsUrl + avatar.pop().filename);
      } catch (error) {
        console.error(error.message);
      }
    };

    const getBio = async () => {
      let realEmail;
      let bio;
      const userToken = await AsyncStorage.getItem('userToken');
      const userInfo = await getUser(user.user_id, userToken);
      const fullEmail = userInfo.email;
      if (fullEmail.includes(']')) {
        const fullEmailWithBio = JSON.parse(fullEmail);
        realEmail = fullEmailWithBio[0];
        console.log('real email here: ' + realEmail);
        bio = fullEmailWithBio[1];
        console.log('bio here: ' + bio);
      }
      else {bio = ""}
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

      console.log(result);

      if (!result.cancelled) {
        // console.log('pickImage result', result);
        setFiletype(result.type);
        // console.log('here is the result file ' + result.uri);
        setImage(result.uri);
      }
    };

    return (
      <ScrollView>
        <KeyboardAvoidingView behavior="position" enabled>
          {image === null ? (
            <Image
              source={{uri: avatar}}
              style={styles.image}
              onPress={pickImage}
            />
          ) : (
            <Image
              source={{uri: image}}
              style={styles.image}
              onPress={pickImage}
            />
          )}
          <View style={styles.view}>
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
          <Button title="Choose from library" onPress={() => pickImage(true)}/>
          <Button title="Use camera" onPress={() => pickImage(false)}/>
          {isUploading && <ActivityIndicator size="large" color="#0000ff"/>}
          <Button
            title="Save image"
            onPress={doUpload}
          />
          <Button
            title="Save bio change"
            onPress={combinedFunction}
          />
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
;

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
  image2: {
    marginTop: 16,
    width: '40%',
    height: undefined,
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: 150,
    overflow: 'hidden',
    flex: 1,
  },
  images: {
    flexDirection: 'row',
  },

});

EditProfile.propTypes = {
  navigation: PropTypes.object,
};

export default EditProfile;