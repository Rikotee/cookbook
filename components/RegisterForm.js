import React, {useContext, useEffect} from 'react';
import {View, Button, Alert} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLogin, useRegister} from '../hooks/ApiHooks';
import FormTextInput from '/FormTextInput';
import useSignUpForm from '../hooks/RegisterHooks';

const RegisterForm = ({navigation}) => {
  const {inputs, handleInputChange} = useSignUpForm();
  const {postRegister} = useRegister();

  const doRegister = async () => {
    try {
      const result = await postRegister(inputs);
      console.log('doRegister ok', result.message);
      Alert.alert(result.message);
      // TODO: do automatic login, store token, etc..
    } catch (error) {
      console.log('registration error', error);
      Alert.alert('register fail');
    }
  };

  return (
    <View>
      <FormTextInput
        autoCapitalize="none"
        placeholder="username"
        onChangeText={(txt) => handleInputChange('username', txt)}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="password"
        onChangeText={(txt) => handleInputChange('password', txt)}
        secureTextEntry={true}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="email"
        onChangeText={(txt) => handleInputChange('email', txt)}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="full name"
        onChangeText={(txt) => handleInputChange('full_name', txt)}
      />
      <Button title="Register!" onPress={doRegister} />
    </View>
  );
};

RegisterForm.propTypes = {
  navigation: PropTypes.object,
};

export default RegisterForm;
