import React from 'react';
import {View, Text, Button} from 'react-native';
import {useDispatch} from 'react-redux';
import {signIn} from '../Account/AccountSlice';

export default function SignIn() {
  const dispatch = useDispatch();

  return (
    <View>
      <Text>SignIn</Text>
      <Button onPress={() => dispatch(signIn())} title="Sign In" />
    </View>
  );
}
