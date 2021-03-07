import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {Input, Text, Button} from 'react-native-elements';
import useSearchForm from '../hooks/SearchHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {appIdentifier} from '../utils/variables';
import SRList from '../components/List';

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
      console.log('Search resp', searchData);

    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    // doSearch()
  }, []);

  const doReset = () => {
    setImage(null);
    reset();
  };
  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="position" enabled>
        <View style={styles.post}>
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
            disabled={searchErrors.title !== null}
          />
          <Button title="Reset" onPress={doReset} />
        </View>
        {/* <SRList navigation={navigation} myFilesOnly={false} /> */}
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

Search.propTypes = {
  navigation: PropTypes.object,
};

export default Search;
