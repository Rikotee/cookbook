import React, {useContext} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {Text} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({navigation}) => {
  const {isLoggedIn, setIsLoggedIn} = useContext(MainContext);

  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
  };

  return (
    <SafeAreaView style={styles.StyleSheet}>
      <View style={styles.loginArea}>
        {isLoggedIn ? (
          <Text style={styles.loginText} onPress={logout}>
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
