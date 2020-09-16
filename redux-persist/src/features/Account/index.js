import React from 'react';

import {View, Text, Button} from 'react-native';
import {useDispatch} from 'react-redux';
import { signOut } from '../AuthState/AuthStateSlice';

export default function Account() {
  const dispatch = useDispatch();
  return (
    <View>
      <Text>Account</Text>
      <Button title="Sign Out" onPress={() => dispatch(signOut())} />
    </View>
  );
}
