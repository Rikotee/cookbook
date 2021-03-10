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
import ListItem from '../components/ListItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Picker} from '@react-native-picker/picker';

const Search = ({navigation}) => {
  const {user} = useContext(MainContext);
  const [isSearching] = useState(false);
  const {search} = useMedia();
  const [mediaArray, setMediaArray] = useState([]);
  const {handleInputChange, inputs, searchErrors} = useSearchForm();

  const [selectedTag, setSelectedTag] = useState();
  const [selectedTag2, setSelectedTag2] = useState();
  const [selectedTag3, setSelectedTag3] = useState();

  const doSearch = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const tags = [
      checkNulls(selectedTag),
      checkNulls(selectedTag2),
      checkNulls(selectedTag3)];
    try {
      const searchData = await search(userToken, inputs, tags);
      setMediaArray(searchData);
    } catch (error) {
      console.error(error.message);
    }
    return mediaArray;
  };

  const checkNulls = (item) => {
    if (item == null || item === 0) {
      return '';
    } else return item;
  };

  return (
    <KeyboardAvoidingView behavior="position" enabled>

      <FlatList
        ListHeaderComponent={
          <View style={styles.post}>
            <Text h4>Search recipe</Text>
            <Input
              placeholder="title"
              value={inputs.title}
              onChangeText={(txt) => handleInputChange('title', txt)}
              errorMessage={searchErrors.title}
            />
            {isSearching && <ActivityIndicator size="large" color="#0000ff"/>}
            <Text h4>Time</Text>
            <Picker
              selectedValue={selectedTag}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedTag(itemValue)
              }>
              <Picker.Item label="any" value="0"/>
              <Picker.Item label="Under 30 minutes" value="Under 30 minutes"/>
              <Picker.Item label="30-60 minutes" value="30-60 minutes"/>
              <Picker.Item label="Over 60 minutes" value="Over 60 minutes"/>
            </Picker>
            <Text h4>Type</Text>
            <Picker
              selectedValue={selectedTag2}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedTag2(itemValue)
              }>
              <Picker.Item label="any" value="0"/>
              <Picker.Item label="Pasta & risotto" value="Pasta & risotto"/>
              <Picker.Item label="Salad" value="Salad"/>
              <Picker.Item label="Bread & doughs" value="Bread & doughs"/>
              <Picker.Item label="Vegetable sides" value="Vegetable sides"/>
              <Picker.Item label="Soup" value="Soup"/>
              <Picker.Item label="BBQ food" value="BBQ food"/>
              <Picker.Item label="Stew" value="Stew"/>
            </Picker>
            <Text h4>Main ingredient</Text>
            <Picker
              selectedValue={selectedTag3}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedTag3(itemValue)
              }>
              <Picker.Item label="any" value="0"/>
              <Picker.Item label="Vegetables" value="Vegetables"/>
              <Picker.Item label="Eggs" value="Eggs"/>
              <Picker.Item label="Chicken" value="Chicken"/>
              <Picker.Item label="Pasta" value="Pasta"/>
              <Picker.Item label="Fish" value="Fish"/>
              <Picker.Item label="Bread" value="Bread"/>
              <Picker.Item label="Lamb" value="Lamb"/>
            </Picker>
            <Button
              title="Search recipe"
              onPress={doSearch}
              disabled={searchErrors.title !== null}
            />
          </View>
        }
        data={mediaArray}
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
};

export default Search;
