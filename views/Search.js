import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
} from 'react-native';
import PropTypes from 'prop-types';
import {Input, Text, Button} from 'react-native-elements';
import useSearchForm from '../hooks/SearchHooks';
import ListItem from '../components/ListItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';

const Search = ({navigation}) => {
  const {user} = useContext(MainContext);
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
      console.log(
        'here are inputs: ' + JSON.stringify(inputs) + ' and searchData: ' +
        searchData);
      setMediaArray(searchData);
      console.log('Search resp', searchData);
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
        {isSearching && <ActivityIndicator size="large" color="#0000ff"/>}
        <Button
          title="Search recipe"
          onPress={doSearch}
          disabled={searchErrors.title !== null}
        />
        <Button title="Reset" onPress={doReset}/>
      </View>

      <FlatList
        data={mediaArray.reverse()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <ListItem
            navigation={navigation}
            singleMedia={item}
            isMyFile={item.user_id === user.user_id}
          />
        )}
      />
    </KeyboardAvoidingView>
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
  myFilesOnly: PropTypes.bool,
};

export default Search;
