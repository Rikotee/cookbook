import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {Text} from 'react-native';

const Home = ({navigation}) => {
  return (
    <SafeAreaView style={styles.StyleSheet}>
      <View style={styles.loginArea}>
        <Text
          style={styles.loginText}
          onPress={() => navigation.navigate('Login')}
        >
          Login/Register
        </Text>
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
