import React from 'react';

import { View, Text, Button } from 'react-native';

export default function Home({ navigation }) {
  return (
    <View>
      <Text>Home</Text>
      <Button
        title="Navigate to Sign In"
        onPress={() => navigation.navigate('SignIn')}
      />
    </View>
  );
}
