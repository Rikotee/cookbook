/* eslint-disable no-undef */
import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {Card, ListItem, Text} from 'react-native-elements';

const Login = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const [formToggle, setFormToggle] = useState(true);
  const {checkToken} = useUser();

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    // console.log('token', userToken);
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.form}>
            <View>
              {formToggle ? (
                <>
                  <Card.Title h5>Login</Card.Title>
                  <Card.Divider />
                  <LoginForm navigation={navigation} />
                </>
              ) : (
                <>
                  <Card.Title h5>Register</Card.Title>
                  <Card.Divider />
                  <RegisterForm navigation={navigation} />
                </>
              )}
              <ListItem
                onPress={() => {
                  setFormToggle(!formToggle);
                }}
              >
                <ListItem.Content>
                  <Text style={styles.text}>
                    {formToggle
                      ? 'No account? Register here.'
                      : 'Already registered? Login here.'}
                  </Text>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#FFF',
  },
  text: {
    alignSelf: 'center',
    padding: 20,
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
