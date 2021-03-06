/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Single from '../views/Single';
import Login from '../views/Login';
import {MainContext} from '../contexts/MainContext';
import Upload from '../views/Upload';
import MyFiles from '../views/MyFiles';
import Modify from '../views/Modify';
import Search from '../views/Search';

const Stack = createStackNavigator();

const StackScreen = () => {
  const {isLoggedIn} = useContext(MainContext);
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              title: 'COOKBOOK',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#3d9f9f',
              },
              headerTintColor: '#FFF',
            }}
          />
          <Stack.Screen
            name="Modify"
            component={Modify}
            options={{
              title: 'MODIFY',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#3d9f9f',
              },
              headerTintColor: '#FFF',
            }}
          />
          <Stack.Screen
            name="My Files"
            component={MyFiles}
            options={{
              title: 'MY FILES',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#3d9f9f',
              },
              headerTintColor: '#FFF',
            }}
          />
          <Stack.Screen
            name="Single"
            component={Single}
            options={{
              title: 'RECIPE',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#3d9f9f',
              },
              headerTintColor: '#FFF',
            }}
          />
          <Stack.Screen
            name="Upload"
            component={Upload}
            options={{
              title: 'UPLOAD',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#3d9f9f',
              },
              headerTintColor: '#FFF',
            }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              title: 'PROFILE',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#3d9f9f',
              },
              headerTintColor: '#FFF',
            }}
          />
          <Stack.Screen
            name="Search"
            component={Search}
            options={{
              title: 'SEARCH',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#3d9f9f',
              },
              headerTintColor: '#FFF',
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              title: 'COOKBOOK',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#3d9f9f',
              },
              headerTintColor: '#FFF',
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              title: 'LOGIN',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#3d9f9f',
              },
              headerTintColor: '#FFF',
            }}
          />
          <Stack.Screen
            name="Single"
            component={Single}
            options={{
              title: 'RECIPE',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#3d9f9f',
              },
              headerTintColor: '#FFF',
            }}
          />
          <Stack.Screen
            name="Search"
            component={Search}
            options={{
              title: 'SEARCH',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#3d9f9f',
              },
              headerTintColor: '#FFF',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;
