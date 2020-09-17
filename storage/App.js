import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './store';
import Splash from './src/components/splash';

const nullComponent = () => null;
const Tab = createBottomTabNavigator();
function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Album" component={nullComponent} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();
function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyTabs" component={MyTabs} />
    </Stack.Navigator>
  );
}

function App() {
  return <MyStack />;
}

export default function Root() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Splash />} persistor={persistor}>
        <NavigationContainer>
          <App />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
