import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {Input, Text, Image, Button, Card} from 'react-native-elements';
import useUploadForm from '../hooks/UploadHooks';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {appIdentifier} from '../utils/variables';
import {Video} from 'expo-av';
import {Picker} from '@react-native-picker/picker';

const Upload = ({navigation}) => {
  const [selectedTag, setSelectedTag] = useState();
  const [selectedTag2, setSelectedTag2] = useState();
  const [selectedTag3, setSelectedTag3] = useState();

  const [image, setImage] = useState(null);
  const [filetype, setFiletype] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const {upload} = useMedia();
  const {postTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);

  const {handleInputChange, inputs, uploadErrors, reset} = useUploadForm();

  const checkNulls = (item) => {
    if (item == null || item === 0) {
      return '';
    } else return item;
  };

  const doUpload = async () => {
    const formData = new FormData();
    // add text to formData
    formData.append('title', inputs.title);
    const data = inputs.description;
    const data2 = inputs.description2;
    checkNulls(selectedTag);
    checkNulls(selectedTag2);
    checkNulls(selectedTag3);
    const data3 = [
      checkNulls(selectedTag),
      checkNulls(selectedTag2),
      checkNulls(selectedTag3),
    ];
    const combinedData = JSON.stringify([data, data2]);
    console.log('combinedData: ' + combinedData);
    formData.append('description', combinedData);
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
      const userToken = await AsyncStorage.getItem('userToken');
      const resp = await upload(formData, userToken);
      console.log('upload response = file id: ', resp);
      for (let i = 0; i < data3.length; i++) {
        await addTag(userToken, resp, data3[i]);
      }
      const tagResponse = await postTag(
        {
          file_id: resp,
          tag: appIdentifier,
        },
        userToken
      );
      console.log('posting app identifier', tagResponse);
      Alert.alert(
        'Upload',
        'File uploaded',
        [
          {
            text: 'Ok',
            onPress: () => {
              setUpdate(update + 1);
              doReset();
              navigation.navigate('Home');
            },
          },
        ],
        {cancelable: false}
      );
    } catch (error) {
      Alert.alert('Upload', 'Failed');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const addTag = async (userToken, fileId, tag) => {
    const tagResponse = await postTag(
      {
        file_id: fileId,
        tag: JSON.stringify([appIdentifier, tag]),
      },
      userToken
    );
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {status} = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert(
            'Sorry, we need camera roll and camera permissions to make this work!'
          );
        }
      }
    })();
  }, []);

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
      setFiletype(result.type);
      setImage(result.uri);
    }
  };

  const doReset = () => {
    setImage(null);
    reset();
  };

  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="position" enabled>
        <View style={styles.post}>
          <Text h4>Upload media file</Text>
          {image && (
            <>
              {filetype === 'image' ? (
                <Image
                  source={{uri: image}}
                  style={{width: '100%', height: undefined, aspectRatio: 1}}
                />
              ) : (
                <Video
                  source={{uri: image}}
                  style={{width: '100%', height: undefined, aspectRatio: 1}}
                  useNativeControls={true}
                />
              )}
            </>
          )}
          <Text h4>Time</Text>
          <Picker
            selectedValue={selectedTag}
            onValueChange={(itemValue, itemIndex) => setSelectedTag(itemValue)}
          >
            <Picker.Item label="Please pick time..." value="0" />
            <Picker.Item label="Under 30 minutes" value="Under 30 minutes" />
            <Picker.Item label="30-60 minutes" value="30-60 minutes" />
            <Picker.Item label="Over 60 minutes" value="Over 60 minutes" />
          </Picker>
          <Text h4>Type</Text>
          <Picker
            selectedValue={selectedTag2}
            onValueChange={(itemValue, itemIndex) => setSelectedTag2(itemValue)}
          >
            <Picker.Item label="Please pick type..." value="0" />
            <Picker.Item label="Pasta & risotto" value="Pasta & risotto" />
            <Picker.Item label="Salad" value="Salad" />
            <Picker.Item label="Bread & doughs" value="Bread & doughs" />
            <Picker.Item label="Vegetable sides" value="Vegetable sides" />
            <Picker.Item label="Soup" value="Soup" />
            <Picker.Item label="BBQ food" value="BBQ food" />
            <Picker.Item label="Stew" value="Stew" />
          </Picker>
          <Text h4>Main ingredient</Text>
          <Picker
            selectedValue={selectedTag3}
            onValueChange={(itemValue, itemIndex) => setSelectedTag3(itemValue)}
          >
            <Picker.Item label="please pick main ingredient..." value="0" />
            <Picker.Item label="Vegetables" value="Vegetables" />
            <Picker.Item label="Eggs" value="Eggs" />
            <Picker.Item label="Chicken" value="Chicken" />
            <Picker.Item label="Pasta" value="Pasta" />
            <Picker.Item label="Fish" value="Fish" />
            <Picker.Item label="Bread" value="Bread" />
            <Picker.Item label="Lamb" value="Lamb" />
          </Picker>

          <Input
            placeholder="title"
            value={inputs.title}
            onChangeText={(txt) => handleInputChange('title', txt)}
            errorMessage={uploadErrors.title}
          />
          <Input
            multiline={true}
            placeholder="Instructions"
            value={inputs.description}
            onChangeText={(txt) => handleInputChange('description', txt)}
            errorMessage={uploadErrors.description}
          />
          <Input
            multiline={true}
            placeholder="Ingredients"
            value={inputs.description2}
            onChangeText={(txt) => handleInputChange('description2', txt)}
            errorMessage={uploadErrors.description2}
          />
          <Button title="Choose from library" onPress={() => pickImage(true)} />
          <Button title="Use camera" onPress={() => pickImage(false)} />
          {isUploading && <ActivityIndicator size="large" color="#0000ff" />}
          <Button
            title="Upload file"
            onPress={doUpload}
            disabled={
              uploadErrors.title !== null ||
              uploadErrors.description !== null ||
              image === null
            }
          />
          <Button title="Reset" onPress={doReset} />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  post: {
    padding: 15,
    backgroundColor: '#FFF',
    // marginBottom: 10,
  },
});

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
