import React, {useContext, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
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
  // console.log(props);
  const {deleteFile} = useMedia();
  const {setUpdate, update, isLoggedIn} = useContext(MainContext);
  const [avatar, setAvatar] = useState('http://placekitten.com/100');
  const {getFilesByTag} = useTag();
  const [owner, setOwner] = useState({username: 'somebody'});
  const {getUser} = useUser();
  const [videoRef, setVideoRef] = useState(null);
  // const {file} = route.params;

  const fetchAvatar = async () => {
    if (isLoggedIn) {
      try {
        const avatarList = await getFilesByTag('avatar_' + singleMedia.user_id);
        if (avatarList.length > 0) {
          setAvatar(uploadsUrl + avatarList.pop().filename);
        }
      } catch (error) {
        console.error(error.message);
      }
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

  useEffect(() => {
    unlock();
    fetchAvatar();
    fetchOwner();

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
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Single', {file: singleMedia});
      }}
    >
      <View style={styles.post}>
        {isLoggedIn ? (
          <View style={styles.userInfo}>
            <Avatar style={styles.avatarImage} source={{uri: avatar}} />
            <Text style={styles.userInfoText}>{owner.username}</Text>
          </View>
        ) : (
          <Text
            style={styles.loginText}
            onPress={() => navigation.navigate('Login')}
          >
            Login to see userinfo
          </Text>
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
        <Card.Title h4>{singleMedia.title}</Card.Title>
        <Card.Title>{moment(singleMedia.time_added).format('LL')}</Card.Title>
        <Text style={styles.description}>{singleMedia.description}</Text>
        <RNEListItem.Content>
          {isMyFile && isLoggedIn && (
            <>
              <Card.Divider />
              <View style={styles.buttons}>
                <Button
                  title="Modify"
                  onPress={() => navigation.push('Modify', {file: singleMedia})}
                ></Button>
                <Button title="Delete" color="red" onPress={doDelete}></Button>
              </View>
            </>
          )}
        </RNEListItem.Content>
        {/* <Card.Divider /> */}
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
  description: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 16,
  },
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
