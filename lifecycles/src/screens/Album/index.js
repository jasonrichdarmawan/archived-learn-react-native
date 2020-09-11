import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {ListItem, Card} from 'react-native-elements';

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
  const [view, setView] = React.useState();

  // question: pagination vs load more in Native.

  // TODO: filter settings
  const [itemPerPage, setItemPerPage] = React.useState(10);

  // TODO: dynamic pages
  const [pages, setPages] = React.useState([1, 2, 3, 4, 5]);

  React.useEffect(() => {
    console.log('render');
    fetch(
      `http://jsonplaceholder.typicode.com/albums?_start=${
        currentPage * itemPerPage - itemPerPage
      }&_limit=${itemPerPage}`,
    )
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [currentPage, itemPerPage]);

  function handleItem(i) {
    setLoading(true);
    console.log(`render view ${i}`);
    fetch(`https://jsonplaceholder.typicode.com/photos/${i}`)
      .then((res) => res.json())
      .then((json) => (console.log(json), setView(json)))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
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
      ) : view ? (
        <Card>
          <Card.Title>{view.title}</Card.Title>
          <Card.Divider />
          <Card.Image source={{uri: view.url}} />
        </Card>
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
