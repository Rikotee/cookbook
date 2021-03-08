import React, {useContext} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View, Text} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Avatar, ListItem} from 'react-native-elements';

const Home = ({navigation}) => {
  const {setUpdate, update, isLoggedIn, setIsLoggedIn} = useContext(
    MainContext
  );

  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
  };

  const updateLogout = () => {
    logout();
    // setUpdate(update + 1);
  };

  return (
    <SafeAreaView style={styles.StyleSheet}>
      <View style={styles.loginArea}>
        {isLoggedIn ? (
          <Text style={styles.loginText} onPress={updateLogout}>
            Logout
          </Text>
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
  loginText: {
    color: '#000',
    textAlign: 'right',
    paddingRight: 15,
    paddingBottom: 5,
    paddingTop: 5,
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
