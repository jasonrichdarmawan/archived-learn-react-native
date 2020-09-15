import React from 'react';

import {Provider, useDispatch, useSelector} from 'react-redux';
import store from './store';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, HeaderTitle} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {
  fetchAuthState,
  selectAuthState,
} from './src/features/AuthState/AuthStateSlice';
import Home from './src/features/Home';
import SignIn from './src/features/SignIn';
import Dashboard from './src/features/Dashboard';
import Album from './src/features/Album';

import {Button} from 'react-native';

const SignInComponent = () => null;
const Tab = createBottomTabNavigator();
function MyTabs({navigation}) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Album" component={Album} />
      <Tab.Screen
        options={{
          title: 'Sign In',
          tabBarButton: () => (
            <Button
              onPress={() => navigation.navigate('Sign In')}
              title="Sign In"
            />
          ),
        }}
        name="SignInComponent"
        component={SignInComponent}
      />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();
function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{title: ''}} name="MyTabs" component={MyTabs} />
      <Stack.Screen name="Sign In" component={SignIn} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </Provider>
  );
}
