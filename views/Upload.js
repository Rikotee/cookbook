import React from 'react';
import {View} from 'react-native';
import {Input, Text, Image, Button} from 'react-native-elements';

const Upload = () => {
  return (
    <View>
      <Text>Upload media file</Text>
      <Image
        source={{uri: 'http://placekitten.com/400'}}
        style={{width: '100%', height: undefined, aspectRatio: 16 / 9}}
      />
      <Input />
      <Input />
      <Button title="Choose file" />
      <Button title="Upload file" />
    </View>
  );
};

export default Upload;
