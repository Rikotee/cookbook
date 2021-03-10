import React, {useContext} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View, Text} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Avatar, ListItem} from 'react-native-elements';

const Home = ({navigation}) => {
  const {setUpdate, update, isLoggedIn, setIsLoggedIn, user} = useContext(
    MainContext
  );
  const updateLogout = async () => {
    setIsLoggedIn(false);
    AsyncStorage.clear();
    console.log('user token here: ' + AsyncStorage.getItem('userToken'));
  };

  return (
    <SafeAreaView style={styles.StyleSheet}>
      <View style={styles.loginArea}>
        {isLoggedIn ? (
          <View>
            {/* <Text style={styles.userText}>{user.username}</Text> */}
            <Text style={styles.loginText} onPress={updateLogout}>
              Logout
            </Text>
          </View>
        ) : (
          <Text
            style={styles.loginText}
            onPress={() => navigation.navigate('Login')}
          >
            Login/Register
          </Text>
        )}
      </View>

      {isLoggedIn ? (
        <ListItem bottomDivider onPress={() => navigation.navigate('Search')}>
          <Avatar icon={{name: 'search', color: 'black', size: 30}} />
          <ListItem.Content>
            <ListItem.Title>Search</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ) : (
        <Text
          style={styles.loginText}
          onPress={() => navigation.navigate('Login')}
        >
          Login to use search
        </Text>
      )}

      {isLoggedIn ? (
        <ListItem bottomDivider onPress={() => navigation.navigate('Profile')}>
          <Avatar icon={{name: 'construction', color: 'black', size: 30}} />
          <ListItem.Content>
            <ListItem.Title>Profile</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ) : (
        <Text
          style={styles.loginText}
          onPress={() => navigation.navigate('Login')}
        >
          Login to use search
        </Text>
      )}

      <List navigation={navigation} myFilesOnly={false} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loginArea: {
    height: 30,
    backgroundColor: '#97caca',
  },
  // infoArea: {

  // },
  loginText: {
    color: '#000',
    textAlign: 'right',
    paddingRight: 15,
    paddingBottom: 5,
    paddingTop: 5,
  },
  // userText: {
  //   color: '#000',
  //   textAlign: 'left',
  //   paddingLeft: 15,
  //   paddingBottom: 5,
  //   paddingTop: 5,
  // },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
