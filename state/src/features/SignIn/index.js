import React from 'react';

import {View, Text, Button} from 'react-native';

export default function SignIn({navigation}) {
  return (
    <View>
      <Text>SignIn</Text>
      <Button
        title="Navigate to Dashboard"
        onPress={() => navigation.navigate('MyTabs')}
      />
    </View>
  );
}
