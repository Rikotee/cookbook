import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';
import {Button} from 'react-native-elements';
import {Image} from 'react-native';
import Login from '../views/Login';

const Home = ({navigation}) => {
  return (
    <SafeAreaView style={styles.StyleSheet}>
      <Image
        source={require('../assets/TestLogo.jpg')}
        style={styles.image}
      ></Image>
      <Button title="login" onPress={() => navigation.navigate('Login')} />
      <List navigation={navigation} myFilesOnly={false} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
