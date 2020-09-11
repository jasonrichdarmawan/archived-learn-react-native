import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {ListItem} from 'react-native-elements';

function Item({item, onPress, style}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      <Text>{item}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

export function AlbumScreen() {
  const [isLoading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemPerPage, setItemPerPage] = React.useState(10);
  const [pages, setPages] = React.useState([1, 2, 3, 4, 5]);

  React.useEffect(() => {
    console.log('render');
    fetch(
      `http://jsonplaceholder.typicode.com/albums?_start=${
        currentPage * itemPerPage - itemPerPage
      }&_limit=${itemPerPage}`,
    )
      .then((res) => res.json())
      // .then((json) => setData(json.movies))
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [currentPage, itemPerPage]);

  function handleItem(i) {
    console.log(i);
  }

  function renderItem({item}) {
    const backgroundColor = item === currentPage ? '#4CAF50' : undefined;
    return (
      <Item
        item={item}
        onPress={() => setCurrentPage(item)}
        style={{backgroundColor}}
      />
    );
  }

  return (
    <>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView>
          {data.map((item) => (
            <ListItem
              // TODO:
              key={'listitem' + item.id}
              onPress={() => handleItem(item.id)}
              bottomDivider
              horizontal>
              <ListItem.Content>
                <ListItem.Title>{item.title}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
          <FlatList
            horizontal={true}
            data={pages}
            renderItem={renderItem}
            keyExtractor={(item) => 'page' + item}
          />
        </ScrollView>
      )}
    </>
  );
}
