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

  useEffect(() => {
    fetchAvatar();
    fetchOwner();
  });

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Single', {file: singleMedia});
      }}
    >
      <Card>
        <Card.Title h4>{singleMedia.title}</Card.Title>
        <Card.Title>{moment(singleMedia.time_added).format('LL')}</Card.Title>
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
        {/* <Text>file_id: {singleMedia.file_id}</Text>
        <Text>user_id: {singleMedia.user_id}</Text>
        <Text>type: {singleMedia.media_type}</Text> */}
        <Card.Image
          source={{uri: uploadsUrl + singleMedia.filename}}
          style={styles.image}
          PlaceholderContent={<ActivityIndicator />}
        />

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
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginTop: 10,
    marginBottom: 10,
    // borderRadius: 10,
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
