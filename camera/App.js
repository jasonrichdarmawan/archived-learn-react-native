import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import {Provider, useSelector} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './store';
import Splash from './src/components/splash';
import SignIn from './src/features/SignIn';
import Account from './src/features/Account';
import {selectAccount} from './src/features/Account/AccountSlice';
import {TouchableOpacity} from 'react-native';
import ListAlbum from './src/features/Album/ListAlbum';
import {ViewAlbum} from './src/features/Album/ViewAlbum';
import AddAlbum from './src/features/Album/AddAlbum';
import Home from './src/features/Home';
import Gallery from './src/features/Gallery';

const nullComponent = () => null;
const Tab = createBottomTabNavigator();
function MyTabs() {
  const {isAuthorized} = useSelector(selectAccount);
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen
        name="GalleryNull"
        component={nullComponent}
        options={({navigation}) => ({
          title: 'Gallery',
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => navigation.navigate('Gallery')}
            />
          ),
        })}
      />
      <Tab.Screen name="Album" component={ListAlbum} />
      {isAuthorized === true ? (
        <Tab.Screen name="Account" component={Account} />
      ) : (
        isAuthorized === false && (
          <Tab.Screen
            name="SignInNull"
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
        options={({route}) => ({
          title: getFocusedRouteNameFromRoute(route) ?? 'Home',
        })}
      />
      {isAuthorized === false && (
        <Stack.Screen name="Sign In" component={SignIn} />
      )}
      <Stack.Screen name="Gallery" component={Gallery} />
      <Stack.Screen name="View Album" component={ViewAlbum} />
      <Stack.Screen name="Add Album" component={AddAlbum} />
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
