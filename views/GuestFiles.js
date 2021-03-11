import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';

// This is used to show other users posts in a list
const GuestFiles = ({navigation}) => {
  return (
    <SafeAreaView style={styles.StyleSheet}>
      <List navigation={navigation} guestFilesOnly={true} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

GuestFiles.propTypes = {
  navigation: PropTypes.object,
};

export default GuestFiles;
