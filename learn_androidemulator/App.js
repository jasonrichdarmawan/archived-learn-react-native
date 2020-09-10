import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {SignInScreen, HomeScreen} from './src/screens';

// import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
// const Tab = createMaterialBottomTabNavigator();
// function BottomTabNavigator() {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator>
//         <Tab.Screen name="Home" component={HomeScreen} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }

const Stack = createStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Sign In"
        screenOptions={{
          headerShown: false,
        }}
        >
        <Stack.Screen name="Sign In" component={SignInScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
