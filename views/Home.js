import React, {useContext} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View, Text} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({navigation}) => {
  const {isLoggedIn, setIsLoggedIn} = useContext(MainContext);
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
