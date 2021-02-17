/* eslint-disable no-undef */
import React, {useContext, useEffect} from 'react';
import {
  StyleSheet,
  View,
  // KeyboardAvoidingView,
  // Platform,
  // Keyboard,
  // TouchableWithoutFeedback,
  // ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';
// import RegisterForm from '../components/RegisterForm';
// import {Card, ListItem, Text} from 'react-native-elements';
import List from '../components/List';
import {SafeAreaView, StatusBar, Image} from 'react-native';

const Login = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  // const [formToggle, setFormToggle] = useState(true);
  const {checkToken} = useUser();

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
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/TestLogo.jpg')}
        style={styles.image}
      ></Image>
      <View style={styles.form}>
        <LoginForm navigation={navigation} />
      </View>
      <View style={styles.list}></View>
      <List navigation={navigation} myFilesOnly={false} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 120,
  },
  form: {
    height: 180,
    width: 130,
  },
  list: {
    flex: 1,
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
