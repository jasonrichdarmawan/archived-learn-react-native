import React from 'react';
import {ActivityIndicator, View} from 'react-native';

export default function Splash() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="#999999" />
    </View>
  );
}
