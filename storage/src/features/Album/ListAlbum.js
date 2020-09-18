import React from 'react';
import {StyleSheet, View, Text, Animated, Button} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {openDatabase} from 'react-native-sqlite-storage';
import Splash from '../../components/splash';

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

const db = openDatabase({name: 'app.db'});

function LeftActions(progress, dragX) {
  // console.log('ListAlbum() LeftActions()', progress, dragX)
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
  // console.log('ListAlbum() LeftActions()', progress, dragX)
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
  // console.log('ListAlbum() Item() render')
  return (
    <View style={[styles.item]}>
      <Text>
        {item.id}, {item.title}
      </Text>
    </View>
  );
}

function SwipeableItem({item, onSwipeFromLeft, onRightPress}) {
  // console.log('ListAlbum() SwipeableItem() render')
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

export default function ListAlbum({navigation}) {
  const [isLoading, setLoading] = React.useState(true);
  const [data, setData] = React.useState();

  function deleteAlbum(id) {
    db.transaction(function (txa) {
      txa.executeSql('DELETE FROM app where id=?', [id], function (txb, resb) {
        console.log('ListAlbum(), deleteAlbum() id', id);
        if (resb.rowsAffected > 0) {
          console.log(`ListAlbum(), deleteAlbum() id ${id} success`);
          setData((old) =>
            old.filter((item) => (item.id === id ? false : true)),
          );
        } else {
          console.error(`ListAlbum(), deleteAlbum() id ${id} failed`);
        }
      });
    });
  }

  function renderItem({item}) {
    // console.log('ListAlbum() renderItem() render', item.id);
    return (
      <SwipeableItem
        item={item}
        onSwipeFromLeft={() =>
          navigation.navigate('View Album', {
            id: item.id,
          })
        }
        onRightPress={() => deleteAlbum(item.id)}
      />
    );
  }

  const renderItemMemo = React.useMemo(() => renderItem, [data]);

  async function fetchAlbum() {
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

  function populateData() {
    db.transaction(function (txa) {
      txa.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='app'",
        [],
        function (txb, resb) {
          // txa.executeSql('DROP TABLE IF EXISTS app', []);

          console.log(
            'ListAlbum(), db.transaction(), item: ',
            resb.rows.length,
          );

          if (resb.rows.length == 0) {
            console.log(
              'ListAlbum(), db.transaction(), DROP TABLE, CREATE TABLE',
            );
            txa.executeSql('DROP TABLE IF EXISTS app', []);
            txa.executeSql(
              'CREATE TABLE IF NOT EXISTS app(id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, title TEXT NOT NULL)',
              [],
            );

            fetchAlbum().then((response) => {
              console.log('ListAlbum() fetchAlbum()');
              setData(response);
              db.transaction(function (txc) {
                response.map((item) =>
                  txc.executeSql(
                    `INSERT INTO app (id, userId, title) VALUES (?,?,?)`,
                    [item.id, item.userId, item.title],
                    function (txd, resd) {
                      if (resd.rowsAffected > 0) {
                        console.log(
                          `ListAlbum(), db.transaction(), INSERT id ${item.id} success`,
                        );
                      } else {
                        console.error(
                          `ListAlbum(), db.transaction(), INSERT id ${item.id} failed`,
                        );
                      }
                    },
                  ),
                );
              });
            });
          } else {
            txa.executeSql('SELECT * FROM app', [], function (txd, resd) {
              console.log('ListAlbum(), db.transaction(), SELECT *');

              let temp = [];
              for (let i = 0; i < resd.rows.length; i++) {
                temp.push(resd.rows.item(i));
              }

              setData(temp);
              setLoading(false);
            });
          }
        },
      );
    });
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('ListAlbum() syncAlbum()');
      populateData();
    });

    return unsubscribe;
  }, []);

  return (
    <>
      {isLoading === true ? (
        <Splash />
      ) : (
        <>
          <Button
            title="Add"
            onPress={() => navigation.navigate('Add Album')}
          />
          <FlatList
            data={data}
            keyExtractor={({id}) => 'albumId: ' + id}
            renderItem={renderItemMemo}
            ItemSeparatorComponent={Separator}
          />
        </>
      )}
    </>
  );
}
