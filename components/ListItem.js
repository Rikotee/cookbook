import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

const ListItem = (props) => {
  console.log(props);
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.row}>
        <View style={styles.imagebox}>
          <Image
            style={{width: 100, height: 100}}
            source={{uri: props.singleMedia.thumbnails.w160}}
          />
        </View>
        <View style={styles.textbox}>
          <Text style={styles.listTile}>{props.singleMedia.title}</Text>
          <Text style={styles.texts}>{props.singleMedia.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#eee',
    borderRadius: 9,
    borderWidth: 3,
    borderColor: 'grey',
  },
  imagebox: {
    flex: 1,
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'grey',
  },
  image: {
    flex: 1,
  },
  textbox: {
    flex: 2,
    padding: 10,
  },
  listTile: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingBottom: 15,
    color: 'orange',
  },
  texts: {
    color: 'grey',
    fontSize: 17,
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object,
};

export default ListItem;
