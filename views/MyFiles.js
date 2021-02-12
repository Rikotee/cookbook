import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';

const MyFiles = ({navigation}) => {
  return (
    <SafeAreaView style={styles.StyleSheet}>
      <List navigation={navigation} myFilesOnly={true} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

MyFiles.propTypes = {
  navigation: PropTypes.object,
};

export default MyFiles;
