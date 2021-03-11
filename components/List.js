import React, {useContext} from 'react';
import {FlatList} from 'react-native';
import {useLoadMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';

const List = ({navigation, myFilesOnly, guestFilesOnly}) => {
  const {user, guest} = useContext(MainContext);
  const mediaArray = useLoadMedia(myFilesOnly, user.user_id, guestFilesOnly, guest.user_id);
  return (
    <FlatList
      contentContainerStyle={{paddingBottom: 30}}
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
  );
};

List.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
  guestFilesOnly: PropTypes.bool,
};

export default List;
