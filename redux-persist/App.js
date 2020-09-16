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
  signIn,
} from './src/features/AuthState/AuthStateSlice';

import Home from './src/features/Home';
import Feed from './src/features/Feed';
import SignIn from './src/features/SignIn';
import Album from './src/features/Album';
import Account from './src/features/Account';

import {Button, View, Text} from 'react-native';

import Modal from 'react-native-modal';

import Splash from './src/components/Splash';

function PayScreenModal() {
  const [isModalVisible, setModalVisible] = React.useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={{flex: 1}}>
      <Button title="Show modal" onPress={toggleModal} />

      <Modal
        isVisible={isModalVisible}
        // onBackdropPress={toggleModal}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="down">
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text>Hello!</Text>
        </View>
      </Modal>
    </View>
  );
}

const nullComponent = () => null;
const Tab = createBottomTabNavigator();
function MyTabs({isAuthorized}) {
  // const {isAuthorized} = useSelector(selectAuthState);
  console.log('MyTabs() isAuthorized', isAuthorized); // Screen can't pass props.
  const dispatch = useDispatch();

  if (isAuthorized === false) {
    setTimeout(() => {
      dispatch(signIn());
    }, 3000);
  }

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Album" component={Album} />
      <Tab.Screen
        name="Pay"
        component={nullComponent}
        options={{tabBarButton: () => <PayScreenModal />}}
      />
      {isAuthorized === false ? (
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
          component={nullComponent}
        />
      ) : (
        <Tab.Screen name="Account" component={Account} />
      )}
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();
function MyStack() {
  const {isAuthorized} = useSelector(selectAuthState);
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerTitle: '',
        }}
        name="MyTabs"
      >
        {/* see why callback is bad in question #1's reference */}
        {() => <MyTabs isAuthorized={isAuthorized} />}
      </Stack.Screen>
      {isAuthorized === false && (
        <Stack.Screen name="Sign In" component={SignIn} />
      )}
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

// question #1: Is callback better than Redux in this case?
// reference: https://stackoverflow.com/questions/47027401/pass-props-stacknavigator
// note: React Navigation 5 `Screen` can't pass props, the alternative is Callback, Context or Redux.

function App() {
  const {isAuthorized} = useSelector(selectAuthState);

  const dispatch = useDispatch();
  if (isAuthorized === undefined) {
    dispatch(fetchAuthState());
    return <Splash />;
  }

  return <MyDrawer />;
}

export default function Root() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <App />
      </NavigationContainer>
    </Provider>
  );
}
