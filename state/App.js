import React from 'react';

import { Provider } from "react-redux";

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Home from './src/features/Home';
import SignIn from './src/features/SignIn';
import Dashboard from './src/features/Dashboard';
import Album from './src/features/Album';

const Tab = createBottomTabNavigator();
function MyTabs() {
  return (
    <Tab.Navigator initialRouteName="Dashboard">
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Album" component={Album} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();
function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={
        {
          // headerShown: false,
        }
      }>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="SignIn" component={SignIn} />

      <Stack.Screen name="MyTabs" component={MyTabs} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </Provider>
  );
}
