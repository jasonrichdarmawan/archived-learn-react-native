import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {SignInScreen, HomeScreen, AlbumScreen} from './src/screens';

// import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
// const Tab = createMaterialBottomTabNavigator();
// function BottomTabNavigator() {
//   return (
//     <NavigationContainer>
//       <Tab.Screen name="Home" component={HomeScreen} />
//     </NavigationContainer>
//   );
// }

// import {
//   View,
//   Text,
//   Button,
//   TextInput,
//   Keyboard,
//   StyleSheet,
// } from 'react-native';
// function App() {
//   const [foo, setFoo] = React.useState(30);
//   const [bar, setBar] = React.useState();
//   // question: React.useEffect !== useEffect.
//   // import React, { useEffect } from "react";
//   React.useEffect(() => {
//     // componentDidMount equivalent
//     if (foo >= 42) {
//       setFoo(42);
//       setBar(1);
//     }
//     console.log('render', foo, bar);

//     Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
//     Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

//     // componentWillUnmount equivalent
//     return function cleanup() {
//       console.log('cleanup'); // re-render only if the UseEffect 2nd argument / the depedencies changes.
//       Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
//       Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
//     };
//   }, [foo, bar]);

//   function _keyboardDidShow() {
//     alert('Keyboard Shown');
//   }

//   function _keyboardDidHide() {
//     alert('Keyboard Hidden');
//   }

//   return (
//     <View>
//       <Text>Foo is {foo}.</Text>
//       {bar && <Text>Bar is {bar}</Text>}
//       <Button onPress={() => setFoo(foo + 1)} title="Increase Foo!" />
//       <TextInput
//         style={s.input}
//         placeholder="Click here ..."
//         onSubmitEditing={Keyboard.dismiss}
//       />
//     </View>
//   );
// }

// const s = StyleSheet.create({
//   input: {
//     margin: 60,
//     padding: 10,
//     borderWidth: 0.5,
//     borderRadius: 4,
//     backgroundColor: '#fff',
//   },
// });

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
        <Stack.Screen name="Album" component={AlbumScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
