import React from 'react';
import {View, Text, Button} from 'react-native';
import {useDispatch} from 'react-redux';
import {signOut} from './AccountSlice';

export default function Account() {
  const dispatch = useDispatch();

  return (
    <View>
      <Text>Account</Text>
      <Button onPress={() => dispatch(signOut())} title="Sign Out" />
    </View>
  );
}
