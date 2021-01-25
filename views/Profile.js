import React, {useContext} from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card, Text, Button, ListItem, Avatar} from 'react-native-elements';

const Profile = ({navigation}) => {
  const {isLoggedIn, setIsLoggedIn, user} = useContext(MainContext);
  console.log('profile isLoggedIn?', isLoggedIn);
  console.log('profile user data', user);
  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
    if (!isLoggedIn) {
      // this is to make sure isLoggedIn has changed, will be removed later
      navigation.navigate('Login');
    }
  };
  return (
    <Card>
      <Card.Title>
        <Text h1>{user.username}</Text>
      </Card.Title>
      <Card.Image
        source={{uri: 'http://placekitten.com/400'}}
        style={styles.image}
        PlaceholderContent={<ActivityIndicator />}
      />
      <ListItem>
        <Avatar icon={{name: 'email', color: 'black'}} />
        <Text>{user.email}</Text>
      </ListItem>
      <ListItem>
        <Avatar icon={{name: 'user', type: 'font-awesome', color: 'black'}} />
        <Text>{user.full_name}</Text>
      </ListItem>
      <Button title={'Logout'} onPress={logout} />
    </Card>
  );
};

const styles = StyleSheet.create({
  image: {width: '100%', height: undefined, aspectRatio: 1},
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
