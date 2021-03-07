import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import {Input, Text, Button} from 'react-native-elements';
import useSearchForm from '../hooks/SearchHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import SRList from '../components/SRList';
import ListItem from './ListItem';

const Search = ({navigation}) => {
  const [image, setImage] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const {search} = useMedia();
  const {postTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);
  const [mediaArray, setMediaArray] = useState([]);
  const {handleInputChange, inputs, searchErrors, reset} = useSearchForm();

  const doSearch = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const searchData = await search(userToken, inputs);
      setMediaArray(searchData);
      // console.log('Search resp', searchData);
    } catch (error) {
      console.error(error.message);
    }
    console.log('Search resp', mediaArray);
    return mediaArray;
  };

  useEffect(() => {
    // doSearch();
  }, []);

  const doReset = () => {
    setImage(null);
    reset();
  };

  return (
    // <ScrollView>
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

      <View>
        <FlatList
          data={mediaArray.reverse()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <ListItem navigation={navigation} singleMedia={item} />
          )}
        />
        <SRList navigation={navigation} myFilesOnly={false} />
      </View>
    </KeyboardAvoidingView>
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  post: {
    padding: 15,
    backgroundColor: '#FFF',
    // marginBottom: 10,
  },

  // list: {
  //   padding: 15,
  //   backgroundColor: '#FFF',
  //   // marginBottom: 10,
  // },
  // text: {
  //   size: 20,
  // },
});

Search.propTypes = {
  navigation: PropTypes.object,
};

export default Search;
