import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import {Input, Text, Button, Card} from 'react-native-elements';
import useSearchForm from '../hooks/SearchHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {appIdentifier} from '../utils/variables';

const Search = ({navigation}) => {
  const [image, setImage] = useState(null);
  const [filetype, setFiletype] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const {search} = useMedia();
  const {postTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);

  const {handleInputChange, inputs, searchErrors, reset} = useSearchForm();

  const doSearch = async () => {
     const formData = new FormData();
     // add text to formData
     formData.append('title', inputs.title);
  //   const filename = image.split('/').pop();
  //   const match = /\.(\w+)$/.exec(filename);
  //   let type = match ? `${filetype}/${match[1]}` : filetype;
  //   if (type === 'image/jpg') type = 'image/jpeg';
  //   formData.append('file', {
  //     uri: image,
  //     name: filename,
  //     type: type,
  //   });
    try {
       setIsSearching(true);
       const userToken = await AsyncStorage.getItem('userToken');
       const resp = await search(formData, userToken);
       console.log('search response', resp);
       const tagResponse = await postTag(
         {
           file_id: resp.file_id,
           tag: appIdentifier,
         },
         userToken
       );
       console.log('posting app identifier', tagResponse);
  //     Alert.alert(
  //       'Search',
  //       'File uploaded',
  //       [
  //         {
  //           text: 'Ok',
  //           onPress: () => {
  //             setUpdate(update + 1);
  //             doReset();
  //             navigation.navigate('Home');
  //           },
  //         },
  //       ],
  //       {cancelable: false}
  //     );
    } catch (error) {
      Alert.alert('Search', 'Failed');
      console.error(error);
    } finally {
      setIsSearching(false);
    }
   };

   useEffect(() => {

  }, []);



  const doReset = () => {
    setImage(null);
    reset();
  };
  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="position" enabled>
        <Card>
          <Text h4>Search recipe</Text>
          <Input
            placeholder="title"
            value={inputs.title}
            onChangeText={(txt) => handleInputChange('title', txt)}
            errorMessage={searchErrors.title}
          />
          {isSearching && <ActivityIndicator size="large" color="#0000ff" />}
          <Button
            title="Search recipe"
            onPress={doSearch}
            disabled={
              searchErrors.title !== null
            }
          />
          <Button title="Reset" onPress={doReset} />
        </Card>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

Search.propTypes = {
  navigation: PropTypes.object,
};

export default Search;
