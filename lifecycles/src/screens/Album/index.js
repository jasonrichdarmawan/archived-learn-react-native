import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {ListItem, Card, Avatar} from 'react-native-elements';

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

  const [albumId, setAlbumId] = React.useState();
  const [filteredData, setFilteredData] = React.useState();
  const [viewData, setViewData] = React.useState();

  // question: pagination vs load more in Native.

  // TODO: filter settings
  const [itemPerPage, setItemPerPage] = React.useState(10);

  const [pages, setPages] = React.useState([1, 2, 3, 4, 5]);

  React.useEffect(() => {
    if (!albumId) {
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
    } else if (albumId) {
      console.log(`render albumId ${albumId}`);
      fetch(
        `https://jsonplaceholder.typicode.com/photos?albumId=${albumId}&_start=${
          currentPage * itemPerPage - itemPerPage
        }&_limit=${itemPerPage}`,
      )
        .then((res) => res.json())
        .then((json) => setFilteredData(json))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }
  }, [currentPage, itemPerPage, albumId]);

  function handleFilter(i) {
    setCurrentPage(1);
    setItemPerPage(10);

    setLoading(true);
    setAlbumId(i);
  }

  function handleChangePage(item) {
    console.log(item);
    setCurrentPage(item);
    setPages((pages) => pages.map((page) => page + 1));
  }

  function renderItem({item}) {
    const backgroundColor = item === currentPage ? '#4CAF50' : undefined;
    return (
      <Item
        item={item}
        onPress={() => handleChangePage(item)}
        style={{backgroundColor}}
      />
    );
  }

  function handleView(i) {
    setViewData(filteredData[i]);
  }

  return (
    <>
      {isLoading ? (
        <ActivityIndicator />
      ) : filteredData ? (
        viewData ? (
          <Card>
            <Card.Title>{viewData.title}</Card.Title>
            <Card.Divider />
            <Card.Image source={{uri: viewData.url}} />
          </Card>
        ) : (
          <ScrollView>
            {filteredData.map((l, i) => (
              <ListItem
                key={'listitem' + i}
                onPress={() => handleView(i)}
                bottomDivider>
                <Avatar source={{uri: l.thumbnailUrl}} />
                <ListItem.Content>
                  <ListItem.Title>{l.title}</ListItem.Title>
                  {/* <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle> */}
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
        )
      ) : (
        <ScrollView>
          {data.map((item) => (
            <ListItem
              // TODO:
              key={'listitem' + item.id}
              onPress={() => handleFilter(item.id)}
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
