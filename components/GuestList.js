import React, {useContext} from 'react';
import {FlatList} from 'react-native';
import {useLoadMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';

const GuestList = ({navigation, guestFilesOnly}) => {
  const {guest} = useContext(MainContext);
  const mediaArray = useLoadMedia(guestFilesOnly, guest.user_id);

  return (
    <FlatList
      data={mediaArray}
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

GuestList.propTypes = {
  navigation: PropTypes.object,
  guestFilesOnly: PropTypes.bool,
};

export default GuestList;
