import {StyleSheet, Platform} from 'react-native';
export default StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  bgImage: {
    width: '100%',
    height: 250,
  },
  container: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: 'lightgrey',
    height: '100%',
    paddingTop: 0,
  },
  header: {
    height: 250,
    backgroundColor: 'white',
  },
  menu: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  settings: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  hello: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    fontSize: 20,
  },
});
