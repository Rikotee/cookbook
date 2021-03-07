import React, {useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator, View} from 'react-native';
import PropTypes from 'prop-types';
import {appIdentifier, uploadsUrl} from '../utils/variables';
import {Avatar, Card, ListItem, Text} from 'react-native-elements';
import moment from 'moment';
import {useTag, useUser} from '../hooks/ApiHooks';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import {ScrollView} from 'react-native-gesture-handler';

const Single = ({route}) => {
  const [fetchDescription, setFetchDescription] = useState('')
  const [fetchIngredients, setFetchIngredients] = useState('')
  const [fetchTags, setFetchTags] = useState('')
  const [fetchTags2, setFetchTags2] = useState('');
  const [fetchTags3, setFetchTags3] = useState('');

  const {file} = route.params;
  const [avatar, setAvatar] = useState('http://placekitten.com/100');
  const [owner, setOwner] = useState({username: 'somebody'});
  const {getFilesByTag, getTagsOfFile} = useTag();
  const {getUser} = useUser();
  const [videoRef, setVideoRef] = useState(null);

  const fetchAvatar = async () => {
    try {
      const avatarList = await getFilesByTag('avatar_' + file.user_id);
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
      const userData = await getUser(file.user_id, userToken);
      setOwner(userData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getFileTags = async () => {
    let actualTag;
    let actuallyActualTag;
    const actualTags = [];
    const tags = await getTagsOfFile(file.file_id);
    for (let i = 0; i < tags.length; i++) {
      if (tags[i].tag !== appIdentifier) {
        actualTag = tags[i].tag;
        actuallyActualTag = JSON.parse(actualTag)[1];
        actualTags.push(actuallyActualTag);
      }
    }
    if (actualTags[0] !== '') {
      setFetchTags('Time: ' + actualTags[0]);
    }
    if (actualTags[1] !== '') {
      setFetchTags2('Type: ' + actualTags[1]);
    }
    if (actualTags[2] !== '') {
      setFetchTags3('Main ingredient: ' + actualTags[2]);
    }
    ;
  };

  const fetchFullDesc = async () => {
    let realDescription;
    let incridients;
    let tags;
    const fullDescription = file.description;
    if (fullDescription.includes(']')) {
      const fullDescWithIncridients = JSON.parse(fullDescription);
      realDescription = fullDescWithIncridients[0];
      incridients = fullDescWithIncridients[1];
      tags = fullDescWithIncridients[2];
      console.log('real description here: ' + realDescription);
      console.log('incridients here: ' + incridients);
      console.log(file.file_id)
    } else {
      realDescription = file.description;
      incridients = "this shouldn't be empty"
      tags = "this shouldn't be empty"
    }
    setFetchDescription(realDescription)
    setFetchIngredients(incridients)
    setFetchTags(tags)
  };

  const unlock = async () => {
    try {
      await ScreenOrientation.unlockAsync();
    } catch (error) {
      console.error('unlock', error.message);
    }
  };

  const lock = async () => {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } catch (error) {
      console.error('lock', error.message);
    }
  };

  const handleVideoRef = (component) => {
    setVideoRef(component);
  };

  const showVideoInFullscreen = async () => {
    try {
      if (videoRef) await videoRef.presentFullscreenPlayer();
    } catch (error) {
      console.error('fullscreen', error.message);
    }
  };

  useEffect(() => {
    unlock();
    fetchAvatar();
    fetchOwner();
    fetchFullDesc()
    getFileTags()


    const orientSub = ScreenOrientation.addOrientationChangeListener((evt) => {
      console.log('orientation', evt);
      if (evt.orientationInfo.orientation > 2) {
        // show video in fullscreen
        showVideoInFullscreen();
      }
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(orientSub);
      lock();
    };
  }, [videoRef]);

  return (
    <ScrollView>
      <Card>
        <Card.Title h4>{file.title}</Card.Title>
        <Card.Title>{moment(file.time_added).format('LLL')}</Card.Title>
        <Card.Divider />
        {file.media_type === 'image' ? (
          <Card.Image
            source={{uri: uploadsUrl + file.filename}}
            style={styles.image}
            PlaceholderContent={<ActivityIndicator />}
          />
        ) : (
          <Video
            ref={handleVideoRef}
            source={{uri: uploadsUrl + file.filename}}
            style={styles.image}
            useNativeControls={true}
            resizeMode="cover"
            onError={(err) => {
              console.error('video', err);
            }}
            posterSource={{uri: uploadsUrl + file.screenshot}}
          />
        )}
        <Card.Divider />
        <Text style={styles.description} h4>
          Instructions:
        </Text>
        <Text style={styles.description}>
          {fetchDescription}
        </Text>
        <Text style={styles.description} h4>
          Ingredients:
        </Text>
        <Text style={styles.description}>
          {fetchIngredients}
        </Text>
        <Text style={styles.description} h4>
          Tags:
        </Text>
        <Text style={styles.description}>
          {fetchTags}
        </Text>
        <Text style={styles.description}>
          {fetchTags2}
        </Text>
        <Text style={styles.description}>
          {fetchTags3}
        </Text>
        <ListItem>
          <Avatar source={{uri: avatar}} />
          <Text>{owner.username}</Text>
        </ListItem>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  description: {
    marginBottom: 10,
  },
});

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
