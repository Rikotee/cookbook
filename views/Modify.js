import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView, StyleSheet, View,
} from 'react-native';
import PropTypes from 'prop-types';
import {Input, Text, Button, Card} from 'react-native-elements';
import useUploadForm from '../hooks/UploadHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';

const Modify = ({navigation, route}) => {
  const {file} = route.params;
  const [isUploading, setIsUploading] = useState(false);
  const {updateFile} = useMedia();
  const {update, setUpdate} = useContext(MainContext);

  const {
    handleInputChange,
    inputs,
    setInputs,
    uploadErrors,
    reset,
  } = useUploadForm();

  const doUpdate = async () => {
    try {
      setIsUploading(true);
      const userToken = await AsyncStorage.getItem('userToken');
      const resp = await updateFile(file.file_id, inputs, userToken);
      console.log('update response', resp);
      setUpdate(update + 1);
      navigation.pop();
    } catch (error) {
      Alert.alert('Update', 'Failed');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const settingInputs = () => {
    console.log(file.description);
    const fullDesc = JSON.parse(file.description);
    console.log(JSON.stringify(fullDesc));
    const instructions = fullDesc[0];
    const ingredients = fullDesc[1];
    setInputs({
      title: file.title,
      description: instructions,
      description2: ingredients,
    });
  };

  useEffect(() => {
    settingInputs();
  }, []);

  const doReset = () => {
    reset();
  };
  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="position" enabled>
        <View style={styles.post}>
          <Text h4>Update file info</Text>
          <Text>Title: </Text>
          <Input
            placeholder="title"
            value={inputs.title}
            onChangeText={(txt) => handleInputChange('title', txt)}
            errorMessage={uploadErrors.title}
          />
          <Text>Instructions: </Text>
          <Input
            placeholder="Instructions"
            value={inputs.description}
            onChangeText={(txt) => handleInputChange('description', txt)}
            errorMessage={uploadErrors.description}
          />
          <Text>Ingredients: </Text>
          <Input
            placeholder="Ingredients"
            value={inputs.description2}
            onChangeText={(txt) => handleInputChange('description2', txt)}
            errorMessage={uploadErrors.description2}
          />
          {isUploading && <ActivityIndicator size="large" color="#0000ff"/>}
          <Button
            title="Update"
            onPress={doUpdate}
            // disabled={
            //   uploadErrors.title !== null || uploadErrors.description !== null
            // }
          />
          <Button title="Reset" onPress={doReset}/>
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
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  // description: {
  //   marginBottom: 10,
  //   textAlign: 'center',
  //   fontSize: 16,
  // },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
  },
  userInfoText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
  },
});

Modify.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default Modify;
