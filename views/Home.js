import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';
import {Button} from 'react-native-elements';
import {View} from 'react-native';
import {Text} from 'react-native';
// import Login from '../views/Login';

const Home = ({navigation}) => {
  return (
    <SafeAreaView style={styles.StyleSheet}>
      <View style={styles.loginArea}>
        <Text style={styles.loginText}>Login/Register</Text>
      </View>
      <Button
        title="Login/Register"
        color="#FFF"
        onPress={() => navigation.navigate('Login')}
      />
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
    color: '#FFF',
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
