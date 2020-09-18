import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './store';
import Splash from './src/components/splash';
import SignIn from './src/features/SignIn';
import Account from './src/features/Account';
import Album from './src/features/Album';
import {selectAccount, signIn} from './src/features/Account/AccountSlice';
import {TouchableOpacity} from 'react-native';

const nullComponent = () => null;
const Tab = createBottomTabNavigator();
function MyTabs() {
  const {isAuthorized} = useSelector(selectAccount);
  return (
    <Tab.Navigator>
      <Tab.Screen name="Album" component={Album} />
      {isAuthorized === true ? (
        <Tab.Screen name="Account" component={Account} />
      ) : (
        isAuthorized === false && (
          <Tab.Screen
            name="SignIn"
            component={nullComponent}
            options={({navigation}) => ({
              title: 'Sign In',
              tabBarButton: (props) => (
                <TouchableOpacity
                  {...props}
                  onPress={() => navigation.navigate('Sign In')}
                />
              ),
            })}
          />
        )
      )}
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();
function MyStack() {
  const {isAuthorized} = useSelector(selectAccount);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyTabs"
        component={MyTabs}
        options={({route}) => ({title: getFocusedRouteNameFromRoute(route)})}
      />
      {isAuthorized === false && (
        <Stack.Screen name="Sign In" component={SignIn} />
      )}
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
