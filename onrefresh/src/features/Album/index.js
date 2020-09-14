import React from 'react';

import {
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Text,
  FlatList,
  RefreshControl,
} from 'react-native';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import {RectButton} from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 8,
    backgroundColor: '#4CAF50',
  },
  rectButton: {
    flex: 1,
    height: 60,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  buttonText: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
});

function Item({item}) {
  return (
    <TouchableOpacity style={[styles.item]}>
      <Text>{`${item.id} ${item.title}`}</Text>
    </TouchableOpacity>
  );
}

export default function Album() {
  const [isLoading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemPerPage, setItemPerPage] = React.useState(20);
  const [data, setData] = React.useState([]);
  const [error, setError] = React.useState();

  React.useEffect(() => {
    console.log('Album() useEffect()');
    fetch(
      `http://jsonplaceholder.typicode.com/albums?_start=${
        currentPage * itemPerPage - itemPerPage
      }&_limit=${itemPerPage}`,
    )
      .then((response) => response.json())
      .then((json) => setData((data) => [...data, ...json]))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [currentPage]);

  // console.log('Album()', data);

  // question: VirtualizedList: You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices like PureComponent, shouldComponentUpdate, etc. {"contentLength": 3179.666748046875, "dt": 627, "prevDt": 658}
  const memo = React.useMemo(() => renderItem, [data]);

  function renderItem({item}) {
    return <Item item={item} />;
  }

  function handleRefresh() {
    console.log('Album() handleRefresh()');
    setLoading(true);

    // simulate fetch
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  function handleLoadMore() {
    // fake limitPage
    if (100 / itemPerPage === currentPage) return;
    console.log('Album() handleLoadMore()');

    setCurrentPage((page) => page + 1);
  }

  return (
    <>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          {error && <Text>{error}</Text>}
          <Swipeable>
            <RectButton
              enabled={false}
              style={styles.rectButton}
              onPress={() => alert('Fourth row clicked')}>
              <Text style={styles.buttonText}>Test</Text>
            </RectButton>
          </Swipeable>
          <Text>Album</Text>
          <SafeAreaView>
            <FlatList
              data={data}
              initialNumToRender={itemPerPage / 2}
              renderItem={memo}
              keyExtractor={(item) =>
                '_' + Math.random().toString(36).substr(2, 9) + item.id
              }
              refreshControl={
                <RefreshControl
                  refreshing={isLoading}
                  onRefresh={handleRefresh}
                />
              }
              onEndReachedThreshold={0.1}
              onEndReached={handleLoadMore}
            />
          </SafeAreaView>
        </>
      )}
    </>
  );
}
