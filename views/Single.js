import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator, View, Alert} from 'react-native';
import PropTypes from 'prop-types';
import {appIdentifier, uploadsUrl} from '../utils/variables';
import {Avatar, Button, Card, ListItem, Text} from 'react-native-elements';
import moment from 'moment';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import {ScrollView} from 'react-native-gesture-handler';
import {Picker} from '@react-native-picker/picker';
import {MainContext} from '../contexts/MainContext';

const Single = ({route}) => {
  const [fetchDescription, setFetchDescription] = useState('');
  const [fetchIngredients, setFetchIngredients] = useState('');
  // const [fetchRating, setFetchRating] = useState('');
  const [fetchTags, setFetchTags] = useState('');
  const [fetchTags2, setFetchTags2] = useState('');
  const [fetchTags3, setFetchTags3] = useState('');
  const {user, getRatings, setGetRatings} = useContext(MainContext);

  const {file} = route.params;
  const [avatar, setAvatar] = useState('http://placekitten.com/100');
  const [owner, setOwner] = useState({username: 'somebody'});
  const {getFilesByTag, getTagsOfFile} = useTag();
  const {rate, getRating, deleteRating} = useMedia();
  const {getUser} = useUser();
  const [videoRef, setVideoRef] = useState(null);
  const [selectedRating, setSelectedRating] = useState('');
  const [fetchRating, setFetchRating] = useState('');
  const [fetchHaveRated, setFetchHaveRated] = useState('');

  const fetchAvatar = async () => {
    try {
      const avatarList = await getFilesByTag(appIdentifier + file.user_id);
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
      if (userToken !== null) {
        const userData = await getUser(file.user_id, userToken);
        setOwner(userData);
      }
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
  };

  const fetchFullDesc = async () => {
    let realDescription;
    let ingredients;
    let tags;
    const fullDescription = file.description;
    if (fullDescription.includes(']')) {
      const fullDescWithIngredients = JSON.parse(fullDescription);
      realDescription = fullDescWithIngredients[0];
      ingredients = fullDescWithIngredients[1];
      tags = fullDescWithIngredients[2];
    } else {
      realDescription = file.description;
      ingredients = "this shouldn't be empty";
      tags = "this shouldn't be empty";
    }
    setFetchDescription(realDescription);
    setFetchIngredients(ingredients);
    setFetchTags(tags);
  };

  const fetchRatings = async () => {
    const rating = await getRating(file.file_id);
    if (rating.length === 0) {
      setFetchRating('No ratings yet');
    } else {
      const rateAmount = rating.length;
      let combinedRating = 0;
      for (let i = 0; i < rateAmount; i++) {
        if (user.user_id !== undefined) {
          if (rating[i].user_id === user.user_id) {
            setFetchHaveRated('true');
          }
        }

        combinedRating += rating[i].rating;
      }
      const realRating = combinedRating / rateAmount;
      setFetchRating(realRating.toFixed(1));
    }
  };

  const addRating = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const fileId = file.file_id;
    const rating = selectedRating;
    console.log('user id here: ' + user.user_id);
    console.log("rating here" + rating)
    if (rating == null || rating === '0' || rating === undefined || rating === "") {
      alert('pick rating first');
    } else {
      if (fetchHaveRated === 'true') {
        const deleteResult = await deleteRating(fileId, userToken);
      }
      const rateResponse = await rate(
        {
          file_id: fileId,
          rating: parseInt(rating),
        },
        userToken
      );
      Alert.alert('Rating', 'Rating succeeded');
    }
    await fetchRatings();
    setGetRatings(!getRatings);
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
    fetchFullDesc();
    getFileTags();
    fetchRatings();

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
      <View style={styles.post}>
        <View style={styles.userInfo}>
          <Avatar
            style={styles.avatarImage}
            source={{uri: avatar}}
            // onPress={goProfile}
          />
          <Text
            style={styles.userInfoText}
            // onPress={goProfile}
          >
            {owner.username}
          </Text>
        </View>

        <Text>Rating: {fetchRating}</Text>

        {user.user_id !== undefined &&
        <View>
          <Picker
            selectedValue={selectedRating}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedRating(itemValue)
            }>
            <Picker.Item label="pick rating..." value="0"/>
            <Picker.Item label="1" value="1"/>
            <Picker.Item label="2" value="2"/>
            <Picker.Item label="3" value="3"/>
            <Picker.Item label="4" value="4"/>
            <Picker.Item label="5" value="5"/>
          </Picker>
          <Button title="Rate" onPress={addRating}/>
        </View>
        }


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
        <Card.Title h4>{file.title}</Card.Title>

        <Text style={styles.description} h4>
          Instructions:
        </Text>
        <Text style={styles.description}>{fetchDescription}</Text>
        <Text style={styles.description} h4>
          Ingredients:
        </Text>
        <Text style={styles.description}>{fetchIngredients}</Text>
        <Text style={styles.description} h4>
          Tags:
        </Text>
        <Text style={styles.description}>{fetchTags}</Text>
        <Text style={styles.description}>{fetchTags2}</Text>
        <Text style={styles.description}>{fetchTags3}</Text>
        <Card.Title>{moment(file.time_added).format('LL')}</Card.Title>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  description: {
    marginBottom: 10,
  },
  post: {
    padding: 15,
    backgroundColor: '#FFF',
    // marginBottom: 10,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  userInfoText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    overflow: 'hidden',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
  },
});

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
