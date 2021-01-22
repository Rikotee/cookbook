import React, {useContext, useEffect} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLogin} from '../hooks/ApiHooks';
import FormTextInput from '/FormTextInput';
import useLoginForm from '../hooks/LoginHooks';

const LoginForm = ({navigation}) => {
  const {inputs, handleInputChange} = useLoginForm();
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
      {/* <Button title="Register!" onPress={doRegister} /> */}
    </View>
  );
};
LoginForm.propTypes = {
  navigation: PropTypes.object,
};

export default LoginForm;
