import React, {useContext, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {appIdentifier, uploadsUrl} from '../utils/variables';
import {
  Avatar,
  Card,
  Text,
  ListItem as RNEListItem,
} from 'react-native-elements';
import {
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import moment from 'moment';
import {Video} from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';

const ListItem = ({navigation, singleMedia, isMyFile}) => {
  const {setUpdate, update, isLoggedIn, setGuest, getRatings} = useContext(
    MainContext
  );
  const {deleteFile, getRating} = useMedia();
  const [avatar, setAvatar] = useState('http://placekitten.com/100');
  const {getFilesByTag, getTagsOfFile} = useTag();
  const [owner, setOwner] = useState({username: 'Login to see user'});
  const {getUser} = useUser();
  const [videoRef, setVideoRef] = useState(null);
  const [fetchTags, setFetchTags] = useState('');
  const [fetchTags2, setFetchTags2] = useState('');
  const [fetchTags3, setFetchTags3] = useState('');
  const [fetchRating, setFetchRating] = useState('');

  const fetchAvatar = async () => {
    if (isLoggedIn) {
      try {
        const avatarList = await getFilesByTag(
          appIdentifier + singleMedia.user_id
        );
        if (avatarList.length > 0) {
          setAvatar(uploadsUrl + avatarList.pop().filename);
        }
      } catch (error) {
        console.error(error.message);
      }
    }
    setUpdate(update + 1);
  };

  const fetchRatings = async () => {
    const rating = await getRating(singleMedia.file_id);
    if (rating.length === 0) {
      setFetchRating('No ratings yet');
    } else {
      const rateAmount = rating.length;
      let combinedRating = 0;
      for (let i = 0; i < rateAmount; i++) {
        combinedRating += rating[i].rating;
      }
      const realRating = combinedRating / rateAmount;
      setFetchRating(realRating.toFixed(1));
    }
  };

  const fetchOwner = async () => {
    if (isLoggedIn) {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const userData = await getUser(singleMedia.user_id, userToken);
        setOwner(userData);
      } catch (error) {
        console.error(error.message);
      }
    }
    setUpdate(update + 1);
    console.log('testing fetchOwner')
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

  // getting tags for this file
  const getFileTags = async () => {
    let actualTag;
    let actuallyActualTag;
    const actualTags = [];
    const tags = await getTagsOfFile(singleMedia.file_id);
    // Looping through the tags and displaying them if it is not empty
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

  useEffect(() => {
    fetchRatings();
  }, [getRatings]);

  useEffect(() => {
    unlock();
    fetchAvatar();
    fetchOwner();
    getFileTags();

    const orientSub = ScreenOrientation.addOrientationChangeListener((evt) => {
      // console.log('orientation', evt);
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

  // When user push avatar or username, goProfile fetch userinformation of the media then set that info to "guest",
  // that is used in AllProfile page to fill all the information and to fetch all users posts.
  const goProfile = async () => {
    const profileInfo = async () => {
      if (isLoggedIn) {
        try {
          const userToken = await AsyncStorage.getItem('userToken');
          const userData = await getUser(singleMedia.user_id, userToken);
          setGuest(userData);
        } catch (error) {
          console.error(error.message);
        }
      }
    };
    await profileInfo();
    navigation.navigate('AllProfile');
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Single', {file: singleMedia});
      }}
    >
      <View style={styles.post}>
        {isLoggedIn ? (
          <View style={styles.userInfo}>
            <Avatar
              style={styles.avatarImage}
              source={{uri: avatar}}
              onPress={goProfile}
            />
            <Text style={styles.userInfoText} onPress={goProfile}>
              {owner.username}
            </Text>
          </View>
        ) : (
          <View style={styles.userInfo}>
            <Avatar style={styles.avatarImage} source={{uri: avatar}} />
            <Text
              style={styles.userInfoText}
              onPress={() => navigation.navigate('Login')}
            >
              Login to see user
            </Text>
          </View>
        )}
        {singleMedia.media_type === 'image' ? (
          <Card.Image
            source={{uri: uploadsUrl + singleMedia.filename}}
            style={styles.image}
            PlaceholderContent={<ActivityIndicator />}
          />
        ) : (
          <Video
            ref={handleVideoRef}
            source={{uri: uploadsUrl + singleMedia.filename}}
            style={styles.image}
            useNativeControls={true}
            resizeMode="cover"
            onError={(err) => {
              console.error('video', err);
            }}
            posterSource={{uri: uploadsUrl + singleMedia.screenshot}}
          />
        )}
        <Text>Rating: {fetchRating}</Text>
        <Card.Title h4>{singleMedia.title}</Card.Title>
        <Text>{fetchTags}</Text>
        <Text>{fetchTags2}</Text>
        <Text>{fetchTags3}</Text>
        <Card.Title>{moment(singleMedia.time_added).format('LL')}</Card.Title>

        <RNEListItem.Content>
          {isMyFile && isLoggedIn && (
            <>
              <Card.Divider />
              <View style={styles.buttons}>
                <Button
                  title="Modify"
                  color="#97caca"
                  onPress={() => navigation.push('Modify', {file: singleMedia})}
                ></Button>
                <Button
                  title="Delete"
                  color="#3d9f9f"
                  onPress={doDelete}
                ></Button>
              </View>
            </>
          )}
        </RNEListItem.Content>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
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
  // description: {
  //   marginBottom: 10,
  //   textAlign: 'center',
  //   fontSize: 16,
  // },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
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
  buttons: {
    flex: 1,
    flexDirection: 'row',
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  isMyFile: PropTypes.bool,
  // route: PropTypes.object,
};

export default ListItem;
