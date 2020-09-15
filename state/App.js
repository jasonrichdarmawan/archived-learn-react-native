import React from 'react';

import {Provider, useDispatch, useSelector} from 'react-redux';
import store from './store';

import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {
  fetchAuthState,
  selectAuthState,
} from './src/features/AuthState/AuthStateSlice';
import Home from './src/features/Home';
import SignIn from './src/features/SignIn';
import Dashboard from './src/features/Dashboard';
import Album from './src/features/Album';
import Feed from './src/features/Feed';

import {Button} from 'react-native';

const SignInComponent = () => null;
const Tab = createBottomTabNavigator();
function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Album" component={Album} />
      <Tab.Screen
        options={({navigation}) => ({
          tabBarButton: () => (
            <Button
              onPress={() => navigation.navigate('Sign In')}
              title="Sign In"
            />
          ),
        })}
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

const Drawer = createDrawerNavigator();
function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        options={{title: 'Home'}}
        name="MyStack"
        component={MyStack}
      />
      <Drawer.Screen name="Feed" component={Feed} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MyDrawer />
      </NavigationContainer>
    </Provider>
  );
}
