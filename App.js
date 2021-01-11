import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {SafeAreaView} from 'react-native';
import List from './components/List';
import GlobalStyles from './components/utils/GlobalStyles';

const App = () => {
  return (
    <SafeAreaView style={GlobalStyles.container}>
      <List />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default App;
