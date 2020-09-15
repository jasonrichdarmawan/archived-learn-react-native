import React from 'react';

import {
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  RefreshControl,
  Animated,
} from 'react-native';

import Swipeable from 'react-native-gesture-handler/Swipeable';

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
        Add to Cart
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

function Item({item, onSwipeFromLeft, onRightPress}) {
  // console.log('Album() Item() render')
  return (
    <Swipeable
      renderLeftActions={LeftActions}
      onSwipeableLeftOpen={onSwipeFromLeft}
      renderRightActions={(progress, dragX) => <RightActions progress={progress} dragX={dragX} onPress={onRightPress} />}

    >
      <View style={[styles.item]}>
        <Text>{`${item.id} ${item.title}`}</Text>
      </View>
    </Swipeable>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

export default function Album() {
  const [isLoading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  // const [itemPerPage, setItemPerPage] = React.useState(20);
  const itemPerPage = 20;
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
      .then((json) => setData((initial) => [...initial, ...json]))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [currentPage]);

  // console.log('Album()', data);

  // question: VirtualizedList: You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices like PureComponent, shouldComponentUpdate, etc. {"contentLength": 3179.666748046875, "dt": 627, "prevDt": 658}
  const memo = React.useMemo(() => renderItem, [data]);

  function renderItem({item}) {
    console.log('Album() renderItem() render', item.id);
    return (
      <Item
        item={item}
        onSwipeFromLeft={() => alert('swiped from the left')}
        onRightPress={() => alert('pressed right')}
      />
    );
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
          <Text>Album</Text>
          <SafeAreaView>
            <FlatList
              data={data}
              // Is this parameter bad for performance? Put it into perspective, it renders 1,5x more if this parameter is set to half.
              // initialNumToRender={itemPerPage / 2}

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
              ItemSeparatorComponent={Separator}
            />
          </SafeAreaView>
        </>
      )}
    </>
  );
}
