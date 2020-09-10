import React from 'react';
import {StyleSheet, View, Text, TextInput, Button} from 'react-native';

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

export function SignInScreen({navigation}) {
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