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
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const searchData = await search(userToken, inputs);
        console.log(searchData);
        // result(searchData);
      } catch (error) {
        console.error(error.message);
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
