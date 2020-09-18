import React from 'react';
import {Button} from 'react-native';
import {Input} from 'react-native-elements';
import {openDatabase} from 'react-native-sqlite-storage';
import Splash from '../../components/splash';

const db = openDatabase({name: 'app.db'});

export function ViewAlbum({route, navigation}) {
  const {id} = route.params;
  const [isLoading, setLoading] = React.useState(true);

  const [inputs, setInputs] = React.useState({userId: '', title: ''});
  const {userId, title} = inputs;

  React.useEffect(() => {
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM app where id=?', [id], function (txb, resb) {
        if (resb.rows.length == 1) {
          setInputs((old) => ({
            ...old,
            userId: '' + resb.rows.item(0).userId,
            title: resb.rows.item(0).title,
          }));
          setLoading(false);
        } else {
          console.error(
            'ViewAlbum() handleView() SELECT * FROM app where id=? not found',
          );
        }
      });
    });
  }, []);

  function handleChange(key, value) {
    setInputs((old) => {
      return {...old, [key]: value};
    });
  }

  function handleSave() {
    db.transaction(function (tx) {
      tx.executeSql(
        'UPDATE app SET userId=?, title=? where id=?',
        [userId, title, id],
        function (txb, resb) {
          if (resb.rowsAffected > 0) {
            console.log(
              'ViewAlbum(), handleSave(), db.transaction(), UPDATE, success',
            );
            navigation.goBack();
          } else {
            console.error(
              'ViewAlbum(), handleSave(), db.transaction(), UPDATE, failed',
            );
          }
        },
      );
    });
  }

  if (isLoading === true) {
    return <Splash />;
  } else {
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
        <Button onPress={handleSave} title="Save" />
      </>
    );
  }
}
