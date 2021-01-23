import React, {useContext, useEffect} from 'react';
import {StyleSheet, View, Text, KeyboardAvoidingView} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLogin} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Login = ({navigation}) => {
  const {isLoggedIn, setIsLoggedIn, setUser} = useContext(MainContext);
  console.log('isLoggedIn?', isLoggedIn);
  const {checkToken} = useLogin();

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    console.log('token', userToken);
    if (userToken) {
      try {
        const userData = await checkToken(userToken);
        setIsLoggedIn(true);
        setUser(userData);
        navigation.navigate('Home');
      } catch (error) {
        console.log('token check failed', error.message);
      }
    }
  };
  useEffect(() => {
    getToken();
  }, []);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <View style={styles.login}>
          <Text>Login</Text>
          <LoginForm navigation={navigation} />
        </View>
      </KeyboardAvoidingView>
      <KeyboardAvoidingView behavior="padding">
        <View style={styles.register}>
          <Text>Register</Text>
          <RegisterForm navigation={navigation} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  login: {
    height: 250,
    width: 170,
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  register: {
    height: 250,
    width: 170,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
