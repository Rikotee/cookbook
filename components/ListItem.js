import React, {useContext, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {
  Avatar,
  Card,
  Text,
  ListItem as RNEListItem,
} from 'react-native-elements';
import {Button, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import moment from 'moment';

const ListItem = ({navigation, singleMedia, isMyFile}) => {
  // console.log(props);
  const {deleteFile} = useMedia();
  const {setUpdate, update, isLoggedIn} = useContext(MainContext);
  const [avatar, setAvatar] = useState('http://placekitten.com/100');
  const {getFilesByTag} = useTag();
  const [owner, setOwner] = useState({username: 'somebody'});
  const {getUser} = useUser();
  // const {file} = route.params;

  const fetchAvatar = async () => {
    try {
      const avatarList = await getFilesByTag('avatar_' + singleMedia.user_id);
      if (avatarList.length > 0) {
        setAvatar(uploadsUrl + avatarList.pop().filename);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const fetchOwner = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await getUser(singleMedia.user_id, userToken);
      setOwner(userData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const doDelete = () => {
    Alert.alert(
      'Delete',
      'this file permanently?',
      [
        {text: 'Cancel'},
        {
          title: 'Ok',
          onPress: async () => {
            const userToken = await AsyncStorage.getItem('userToken');
            try {
              await deleteFile(singleMedia.file_id, userToken);
              setUpdate(update + 1);
            } catch (error) {
              // notify user here?
              console.error(error);
            }
          },
        },
      ],
      {cancelable: false}
    );
  };

  useEffect(() => {
    fetchAvatar();
    fetchOwner();
  });

  return (
    <RNEListItem
      bottomDivider
      onPress={() => {
        navigation.navigate('Single', {file: singleMedia});
      }}
    >
      <Card>
        <Avatar source={{uri: avatar}} />
        <Text>{owner.username}</Text>
        {/* <Text>file_id: {singleMedia.file_id}</Text>
        <Text>user_id: {singleMedia.user_id}</Text>
        <Text>type: {singleMedia.media_type}</Text> */}
        <Text>added: {moment(singleMedia.time_added).format('LL')}</Text>
        <Avatar
          size="large"
          square
          source={{uri: uploadsUrl + singleMedia.thumbnails.w160}}
        ></Avatar>
        <RNEListItem.Content>
          <RNEListItem.Title h4>{singleMedia.title}</RNEListItem.Title>
          <RNEListItem.Subtitle>{singleMedia.description}</RNEListItem.Subtitle>
          {isMyFile && isLoggedIn && (
            <>
              <Button
                title="Modify"
                onPress={() => navigation.push('Modify', {file: singleMedia})}
              ></Button>
              <Button title="Delete" color="red" onPress={doDelete}></Button>
            </>
          )}
        </RNEListItem.Content>
      </Card>
    </RNEListItem>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  isMyFile: PropTypes.bool,
  // route: PropTypes.object,
};

export default ListItem;
