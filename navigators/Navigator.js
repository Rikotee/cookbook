/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Single from '../views/Single';
import Login from '../views/Login';
import {MainContext} from '../contexts/MainContext';
import {Icon} from 'react-native-elements';
import Upload from '../views/Upload';
import MyFiles from '../views/MyFiles';
import Modify from '../views/Modify';
import EditProfile from '../views/EditProfile';
import Search from '../views/Search';
import AllProfile from '../views/AllProfile';
import GuestFiles from '../views/GuestFiles';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          switch (route.name) {
            case 'COOKBOOK':
              iconName = 'lunch-dining';
              break;
            case 'PROFILE':
              iconName = 'account-box';
              break;
            case 'UPLOAD':
              iconName = 'cloud-upload';
              break;
            case 'SEARCH':
              iconName = 'search';
              break;
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#97caca',
        inactiveTintColor: '#3d9f9f',
      }}
    >
      <Tab.Screen name="COOKBOOK" component={Home} />
      <Tab.Screen name="PROFILE" component={Profile} />
      <Tab.Screen name="UPLOAD" component={Upload} />
      <Tab.Screen name="SEARCH" component={Search} />
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const {isLoggedIn} = useContext(MainContext);
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Home"
            component={TabScreen}
            options={({route}) => ({
              headerTitle: getFocusedRouteNameFromRoute(route),
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#3d9f9f',
              },
              headerTintColor: '#FFF',
            })}
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
          <Stack.Screen
            name="AllProfile"
            component={AllProfile}
            options={{
              title: 'USER PROFILE',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#3d9f9f',
              },
              headerTintColor: '#FFF',
            }}
          />
          <Stack.Screen
            name="GuestFiles"
            component={GuestFiles}
            options={{
              title: 'ALL RECIPES',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#3d9f9f',
              },
              headerTintColor: '#FFF',
            }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{
              title: 'EditProfile',
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
