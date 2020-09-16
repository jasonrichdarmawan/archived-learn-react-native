import React from 'react';

import {View, Text, Button} from 'react-native';
import {useDispatch} from 'react-redux';
import {signIn} from '../AuthState/AuthStateSlice';

export default function SignIn() {
  const dispatch = useDispatch();
  return (
    <View>
      <Text>Sign In</Text>
      <Button title="Sign In" onPress={() => dispatch(signIn())} />
    </View>
  );
}
