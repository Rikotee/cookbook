import React from 'react';
import {ScrollView} from 'react-native';
import {Input, Text, Image, Button, Card} from 'react-native-elements';
import useUploadForm from '../hooks/UploadHooks';

const Upload = () => {
  const {handleInputChange, inputs} = useUploadForm();

  return (
    <ScrollView>
      <Text h4>Upload media file</Text>
      <Image
        source={{uri: 'http://placekitten.com/400'}}
        style={{width: '100%', height: undefined, aspectRatio: 1}}
      />
      <Input
        placeholder="title"
        value={inputs.title}
        onChangeText={(txt) => handleInputChange('title', txt)}
      />
      <Input
        placeholder="description"
        value={inputs.description}
        onChangeText={(txt) => handleInputChange('description', txt)}
      />
      <Button title="Choose file" />
      <Button title="Upload file" />
    </ScrollView>
  );
};

export default Upload;
