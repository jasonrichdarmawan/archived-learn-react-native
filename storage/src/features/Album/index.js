import React from 'react';
import {Text} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Splash from '../../components/splash';
import {openDatabase} from 'react-native-sqlite-storage';

const db = openDatabase({name: 'app.db'});

export default function Album() {
  const [isLoading, setLoading] = React.useState(true);
  const [data, setData] = React.useState();

  async function fetchAlbums() {
    try {
      let response = await fetch(
        'https://jsonplaceholder.typicode.com/albums?_start=00&_limit=40',
      );
      let json = await response.json();
      setLoading(false);
      return json;
    } catch (error) {
      console.error(error);
    }
  }

  React.useEffect(() => {
    db.transaction(function (txa) {
      txa.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='app'",
        [],
        function (txb, resb) {
          // txa.executeSql('DROP TABLE IF EXISTS app', []);

          console.log('Album(), db.transaction(), item: ', resb.rows.length);

          if (resb.rows.length == 0) {
            console.log('Album(), db.transaction(), DROP TABLE, CREATE TABLE');
            txa.executeSql('DROP TABLE IF EXISTS app', []);
            txa.executeSql(
              'CREATE TABLE IF NOT EXISTS app(id INTEGER PRIMARY KEY NOT NULL, userId INTEGER NOT NULL, title TEXT)',
              [],
            );

            fetchAlbums().then((response) => {
              // console.log(response);
              setData(response);
              db.transaction(function (txc) {
                response.map((item) =>
                  txc.executeSql(
                    `INSERT INTO app (id, userId, title) VALUES (?,?,?)`,
                    [item.id, item.userId, item.title],
                    function (txd, resd) {
                      console.log(
                        'Album(), db.transaction(), INSERT, id ',
                        item.id,
                      );
                      if (resd.rowsAffected > 0) {
                        console.log(
                          'Album(), db.transaction(), INSERT, success',
                        );
                      } else {
                        console.log(
                          'Album(), db.transaction(), INSERT, failed',
                        );
                      }
                    },
                  ),
                );
              });
            });
          } else {
            txa.executeSql('SELECT * FROM app', [], function (tx, res) {
              console.log('Album(), db.transaction(), SELECT *');

              let temp = [];
              for (let i = 0; i < res.rows.length; i++) {
                temp.push(res.rows.item(i));
              }

              setData(temp);
              setLoading(false);
            });
          }
        },
      );
    });
  }, []);

  return (
    <>
      {isLoading === true ? (
        <Splash />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({id}) => 'albumId: ' + id}
          renderItem={({item}) => (
            <Text>
              {item.id}, {item.title}
            </Text>
          )}
        />
      )}
    </>
  );
}
