import React from 'react';
import {
  StatusBar,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import List from './components/List';
import GlobalStyles from './components/utils/GlobalStyles';
import {Menu} from 'react-native-feather';

const App = () => {
  return (
    <SafeAreaView style={GlobalStyles.container}>
      <StatusBar backgroundColor="rgb(255,160,91)" barStyle="light-content" />
      <View style={GlobalStyles.header}>
        <ImageBackground
          source={require('./assets/cat1.jpg')}
          style={GlobalStyles.bgImage}
          imageStyle={{}}
        ></ImageBackground>
        <Menu stroke="grey" width={35} height={35} style={GlobalStyles.menu} />
        <Text style={GlobalStyles.hello}>Homeless Cats</Text>
      </View>
      <List />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default App;
