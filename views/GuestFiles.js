import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import GuestList from '../components/GuestList';
import PropTypes from 'prop-types';

const GuestFiles = ({navigation}) => {
  return (
    <SafeAreaView style={styles.StyleSheet}>
      <GuestList navigation={navigation} guestFilesOnly={true} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

GuestFiles.propTypes = {
  navigation: PropTypes.object,
};

export default GuestFiles;
