import React from 'react';
import {StyleSheet, View, Text, TextInput, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    margin: 8,
    padding: 10,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  button: {
    margin: 8,
  },
  text: {
    textAlign: 'center',
    margin: 8,
  },
});

function SignInScreen({navigation}) {
  // question: common setInputs, similar to ReactJS?
  // const [email, setEmail] = React.useState();
  // const [password, setPassword] = React.useState();

  function signIn() {
    navigation.navigate('Home');
  }

  return (
    <View style={styles.content}>
      <Text>Email</Text>
      <TextInput
        style={styles.input}
        // onChangeText={(text) => setEmail(text)}
        placeholder="email"
      />
      <Text>Password</Text>
      <TextInput
        style={styles.input}
        // onChangeText={(text) => setPassword(text)}
        secureTextEntry
        placeholder="password"
      />
      <Button
        style={styles.button}
        onPress={signIn}
        title="Sign In"
        accessibilityLabel="Sign In"
      />
    </View>
  );
}

function HomeScreen({navigation}) {
  function signOut() {
    navigation.navigate('Sign In');
  }

  return (
    <View style={styles.content}>
      <Text style={styles.text}>Signed in successfully</Text>
      <Button
        onPress={signOut}
        style={styles.button}
        title="Sign Out"
        accessibilityLabel="Sign Out"
      />
    </View>
  );
}

const Stack = createStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SignInScreen"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Sign In" component={SignInScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
