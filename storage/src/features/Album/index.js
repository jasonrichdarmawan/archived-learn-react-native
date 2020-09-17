import React from 'react';
import {StyleSheet, View, Animated, Text, Button} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import Splash from '../../components/splash';
import {openDatabase} from 'react-native-sqlite-storage';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {Input} from 'react-native-elements';

const styles = StyleSheet.create({
  item: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#e4e4e4',
    marginLeft: 10,
  },
  leftActions: {
    backgroundColor: '#388e3c',
    justifyContent: 'center',
    flex: 1, // continue to swipe.
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    padding: 20,
  },
  rightActions: {
    backgroundColor: '#dd2c00',
    justifyContent: 'center',
    // flex: 1, // continue to swipe.
    alignItems: 'flex-end',
  },
});

function LeftActions(progress, dragX) {
  // console.log('Album() LeftActions()', progress, dragX)
  const scale = dragX.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  return (
    <View style={styles.leftActions}>
      <Animated.Text style={[styles.actionText, {transform: [{scale}]}]}>
        Edit
      </Animated.Text>
    </View>
  );
}

function RightActions({progress, dragX, onPress}) {
  // console.log('Album() LeftActions()', progress, dragX)
  const scale = dragX.interpolate({
    inputRange: [-100, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.rightActions}>
        <Animated.Text style={[styles.actionText, {transform: [{scale}]}]}>
          Delete
        </Animated.Text>
      </View>
    </TouchableOpacity>
  );
}

function Item({item}) {
  // console.log('Album() Item() render')
  return (
    <View style={[styles.item]}>
      <Text>
        {item.id}, {item.title}
      </Text>
    </View>
  );
}

function SwipeableItem({item, onSwipeFromLeft, onRightPress}) {
  // console.log('Album() SwipeableItem() render')
  return (
    <Swipeable
      renderLeftActions={LeftActions}
      onSwipeableLeftOpen={onSwipeFromLeft}
      renderRightActions={(progress, dragX) => (
        <RightActions
          progress={progress}
          dragX={dragX}
          onPress={onRightPress}
        />
      )}>
      <Item item={item} />
    </Swipeable>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const db = openDatabase({name: 'app.db'});

export default function Album() {
  const [isLoading, setLoading] = React.useState(true);
  const [data, setData] = React.useState();

  const [viewId, setViewId] = React.useState();

  function deleteAlbum(id) {
    db.transaction(function (txa) {
      txa.executeSql('DELETE FROM app where id=?', [id], function (txb, resb) {
        console.log('Album(), deleteAlbum() id', id);
        if (resb.rowsAffected > 0) {
          console.log(`Album(), deleteAlbum() id ${id} success`);
          setData((old) =>
            old.filter((item) => (item.id === id ? false : true)),
          );
        } else {
          console.error(`Album(), deleteAlbum() id ${id} failed`);
        }
      });
    });
  }

  function renderItem({item}) {
    // console.log('Album() renderItem() render', item.id);
    return (
      <SwipeableItem
        item={item}
        onSwipeFromLeft={() => handleView(item.id)}
        onRightPress={() => deleteAlbum(item.id)}
      />
    );
  }

  const renderItemMemo = React.useMemo(() => renderItem, [data]);

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
              'CREATE TABLE IF NOT EXISTS app(id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, title TEXT NOT NULL)',
              [],
            );

            fetchAlbums().then((response) => {
              console.log('Album() fetchAlbums()');
              setData(response);
              db.transaction(function (txc) {
                response.map((item) =>
                  txc.executeSql(
                    `INSERT INTO app (id, userId, title) VALUES (?,?,?)`,
                    [item.id, item.userId, item.title],
                    function (txd, resd) {
                      if (resd.rowsAffected > 0) {
                        console.log(
                          `Album(), db.transaction(), INSERT id ${item.id} success`,
                        );
                      } else {
                        console.error(
                          `Album(), db.transaction(), INSERT id ${item.id} failed`,
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

  const [inputs, setInputs] = React.useState({userId: '', title: ''});
  const {userId, title} = inputs;
  function handleView(id) {
    setLoading(true);
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM app where id=?', [id], function (txb, resb) {
        console.log(`Album() handleView() id ${id} item: ${resb.rows.length}`);
        if (resb.rows.length == 1) {
          setInputs((old) => ({
            ...old,
            userId: '' + resb.rows.item(0).userId,
            title: resb.rows.item(0).title,
          }));
          setRes('view');
          setViewId(id);
          setLoading(false);
        } else {
          console.error(
            'Album() handleView() SELECT * FROM app where id=? not found',
          );
        }
      });
    });
  }
  function handleChange(key, value) {
    setInputs((old) => {
      return {...old, [key]: value};
    });
  }
  function handleSave() {
    db.transaction(function (tx) {
      tx.executeSql(
        'UPDATE app SET userId=?, title=? where id=?',
        [userId, title, viewId],
        function (txb, resb) {
          if (resb.rowsAffected > 0) {
            console.log(
              'Album(), handleSave(), db.transaction(), UPDATE, success',
            );
            setData((old) =>
              old.map((item) =>
                item.id === viewId ? {...item, userId, title} : item,
              ),
            );
            setViewId();
          } else {
            console.error(
              'Album(), handleSave(), db.transaction(), UPDATE, failed',
            );
          }
        },
      );
    });
  }

  function handleAdd() {
    db.transaction(function (tx) {
      // question: why I can insert userId with string instead of Integer?
      tx.executeSql('INSERT INTO app (userId, title) VALUES (?,?)', [userId, title], function (txb, resb) {
        if (resb.rowsAffected > 0) {
          console.log('Album() handleAdd() db.transaction() success');
        } else {
          console.log('Album() handleAdd() db.transaction() failed')
        }
      })
    })
  }

  const [req, setReq] = React.useState();
  let content;
  if (req === 'view' && viewId !== undefined) {
    content = (
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
  } else if (req === 'add') {
    content = (
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
  } else {
    content = (
      <>
        <Button title="Add" onPress={() => setReq("add")} />
        <FlatList
          data={data}
          keyExtractor={({id}) => 'albumId: ' + id}
          renderItem={renderItemMemo}
          ItemSeparatorComponent={Separator}
        />
      </>
    );
  }

  return <>{isLoading === true ? <Splash /> : content}</>;
}
