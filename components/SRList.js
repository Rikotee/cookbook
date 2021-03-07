import React, {useContext} from 'react';
import {FlatList} from 'react-native';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
// import {Search} from '../views/Search';
import {useMedia, useLoadMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';

const SRList = ({navigation, myFilesOnly}) => {

  const {search} = useMedia();
  const {user} = useContext(MainContext);
  const mediaArray = useLoadMedia(myFilesOnly, user.user_id);
  // const mediaArrayS = search();

  // console.log('SRList test', mediaArrayS)

  return (
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
  );
};

SRList.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
};

export default SRList;
