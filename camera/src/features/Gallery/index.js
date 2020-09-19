import React from 'react';
import {
  Image,
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableHighlight,
  SafeAreaView,
} from 'react-native';
import RNFS from 'react-native-fs';
import {FlatList} from 'react-native-gesture-handler';
import Splash from '../../components/splash';

export default function Gallery() {
  function listFiles() {
    return RNFS.readDir('/data/user/0/com.storage/cache/Camera')
      .then((response) => {
        // console.log(response);
        return response.map((item) => ({name: item.name, path: item.path}));
      })
      .catch((err) => console.error(err.code, err.message));
  }

  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    listFiles().then((response) => setData(response));
  }, []);

  const [img, setImg] = React.useState();
  function renderItem({item}) {
    return (
      <TouchableHighlight onPress={() => setImg(item.path)}>
        <Image
          source={{
            uri: 'file://' + item.path,
          }}
          style={styles.item}
        />
      </TouchableHighlight>
    );
  }

  if (data === []) return <Splash />;

  return (
    <>
      {img ? (
        <TouchableHighlight style={{flex: 1}} onPress={() => setImg()}>
          <Image
            source={{
              uri: 'file://' + img,
            }}
            style={{flex: 1}}
          />
        </TouchableHighlight>
      ) : (
        <FlatList
          data={data}
          keyExtractor={({name}) => name}
          renderItem={renderItem}
          horizontal={false}
          numColumns={4}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    margin: 2,
    padding: 2,
    width: Dimensions.get('window').width / 4 - 4,
    height: 100,
  },
});
