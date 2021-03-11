import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {Input, Text, Button, ThemeProvider} from 'react-native-elements';
import useUploadForm from '../hooks/UploadHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';

const Modify = ({navigation, route}) => {
  const {file} = route.params;
  const [isUploading, setIsUploading] = useState(false);
  const {updateFile} = useMedia();
  const {update, setUpdate} = useContext(MainContext);
  const {theme} = useContext(MainContext);
  const {
    handleInputChange,
    inputs,
    setInputs,
    uploadErrors,
    reset,
  } = useUploadForm();

  const doUpdate = async () => {
    try {
      const data = inputs.description.replace(/[^a-z0-9 ]/gi, '');
      const data2 = inputs.description2.replace(/[^a-z0-9 ]/gi, '');
      setIsUploading(true);
      const userToken = await AsyncStorage.getItem('userToken');
      const combinedData = JSON.stringify([data, data2]);
      const actualData = {description: combinedData};
      const resp = await updateFile(file.file_id, actualData, userToken);
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
    const fullDesc = JSON.parse(file.description);
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
            multiline={true}
            placeholder="Instructions"
            value={inputs.description}
            onChangeText={(txt) => handleInputChange('description', txt)}
            errorMessage={uploadErrors.description}
          />
          <Text>Ingredients: </Text>
          <Input
            multiline={true}
            placeholder="Ingredients"
            value={inputs.description2}
            onChangeText={(txt) => handleInputChange('description2', txt)}
            errorMessage={uploadErrors.description2}
          />
          {isUploading && <ActivityIndicator size="large" color="#0000ff" />}
          <ThemeProvider theme={theme}>
            <Button
              title="Update"
              onPress={doUpdate}
              // disabled={
              //   uploadErrors.title !== null || uploadErrors.description !== null
              // }
            />
            <Button title="Reset" onPress={doReset} />
          </ThemeProvider>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  post: {
    padding: 15,
    backgroundColor: '#FFF',
  },
});

Modify.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default Modify;
