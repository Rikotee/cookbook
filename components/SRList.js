import React from 'react';
import {FlatList} from 'react-native';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {doSearch} from '../views/Search';

const SRList = ({navigation}) => {
  const mediaArray = doSearch;

  return (
    <FlatList
      data={mediaArray.reverse()}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ListItem
          navigation={navigation}
          singleMedia={item}
        />
      )}
    />
  );
};

SRList.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default SRList;
