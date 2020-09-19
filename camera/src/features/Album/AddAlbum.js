import React from 'react';
import {Input} from 'react-native-elements';
import {Button} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

const db = openDatabase({name: 'app.db'});

export default function AddAlbum({navigation}) {
  const [inputs, setInputs] = React.useState({userId: '', title: ''});
  const {userId, title} = inputs;

  function handleChange(key, value) {
    setInputs((old) => {
      return {...old, [key]: value};
    });
  }

  function handleAdd() {
    db.transaction(function (txa) {
      // question: why I can insert userId with string instead of Integer?
      txa.executeSql(
        'INSERT INTO app (userId, title) VALUES (?,?)',
        [userId, title],
        function (txb, resb) {
          if (resb.rowsAffected > 0) {
            console.log('AddAlbum() handleAdd() db.transaction() success');
            navigation.goBack();
          } else {
            console.log('AddAlbum() handleAdd() db.transaction() failed');
          }
        },
      );
    });
  }

  return (
    <>
      <Input
        label="userId"
        value={userId}
        onChangeText={(value) => handleChange('userId', value)}
      />
      <Input
        label="title"
        value={title}
        onChangeText={(value) => handleChange('title', value)}
      />
      <Button onPress={handleAdd} title="Add" />
    </>
  );
}
