import React from 'react';
import {Text} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Splash from '../../components/splash';

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

  React.useState(() => {
    fetchAlbums().then((response) => {
      // console.log(response);
      setData(response);
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
