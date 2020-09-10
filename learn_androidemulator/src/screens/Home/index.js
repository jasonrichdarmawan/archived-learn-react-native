import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  // Button,
  ScrollView,
} from 'react-native';

import {ListItem, Avatar, Card, Input, Button} from 'react-native-elements';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  button: {
    margin: 8,
  },
  text: {
    textAlign: 'center',
    margin: 8,
  },
});

export function HomeScreen(
  {
    // navigation
  },
) {
  // function signOut() {
  //   navigation.navigate('Sign In');
  // }

  const [list, setList] = React.useState([
    {
      name: 'Amy Farha',
      avatar_url:
        'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
      subtitle: 'Vice President',
    },
    {
      name: 'Chris Jackson',
      avatar_url:
        'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
      subtitle: 'Vice Chairman',
    },
    {
      name: 'brynn',
      avatar_url:
        'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
      subtitle: 'Public Relations',
    },
  ]);

  const [view, setView] = React.useState('table');
  const [title, setTitle] = React.useState('List in Table');
  function handleView() {
    title === 'List in Table'
      ? (setTitle('List in Image'), setView('image'))
      : title === 'List in Image' &&
        (setTitle('List in Table'), setView('table'));
  }

  const [index, setIndex] = React.useState();
  const [inputs, setInputs] = React.useState({
    name: '',
    avatar_url: '',
    subtitle: '',
  });
  const {name, avatar_url, subtitle} = inputs;
  function handleItem(i) {
    setView('item');
    setIndex(i);
    setInputs({
      name: list[i].name,
      avatar_url: list[i].avatar_url,
      subtitle: list[i].subtitle,
    });
  }
  function handleChange(label, value) {
    setInputs((inputs) => {
      return {...inputs, [label]: value};
    });
  }
  function handleSave() {
    setList((list) =>
      list.map((item, i) => (i === index ? {...item, ...inputs} : item)),
    );
    setView('table');
    setIndex();
  }
  function handleDelete() {
    setList((list) => list.filter((item, i) => i !== index));
    setView('table');
    setIndex();
  }

  function handleAdd() {
    setView('add');
  }
  function handleSubmit() {
    setList(list => [...list, inputs])
    setView('table');
  }

  return (
    <>
      <ScrollView>
        {(view === 'table' || view === 'image') && (
          <>
            <Button
              onPress={handleView}
              title={title}
              accessibilityLabel={title}
            />
            <Button
              onPress={handleAdd}
              title="Add"
              accessibilityLabel="Add"
              buttonStyle={[
                styles.button,
                {width: '25%', alignSelf: 'flex-end'},
              ]}
            />
          </>
        )}
        {view === 'table' ? (
          list.map((l, i) => (
            <ListItem
              key={'listitem' + i}
              onPress={() => handleItem(i)}
              bottomDivider>
              <Avatar source={{uri: l.avatar_url}} />
              <ListItem.Content>
                <ListItem.Title>{l.name}</ListItem.Title>
                <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ))
        ) : view === 'image' ? (
          list.map((l, i) => (
            <Card key={'card' + i}>
              <Card.Title>{l.name}</Card.Title>
              <Card.Divider />
              <Card.Image source={{uri: l.avatar_url}} />
              <Text style={styles.text}>{l.subtitle}</Text>
            </Card>
          ))
        ) : view === 'item' ? (
          <>
            {/* question: how to shorten the JSX? */}
            {/* {Object.entries(inputs).map(([key, value], i) => (
              <Input
                key={'input' + i}
                label={key}
                value={value}
                onChangeText={(value) => handleChange(key, value)}
              />
            ))} */}
            <Input
              label="name"
              value={name}
              onChangeText={(value) => handleChange('name', value)}
            />
            <Input
              label="avatar_url"
              value={avatar_url}
              onChangeText={(value) => handleChange('avatar_url', value)}
            />
            <Input
              label="subtitle"
              value={subtitle}
              onChangeText={(value) => handleChange('subtitle', value)}
            />
            <Button
              onPress={handleSave}
              title="Save"
              accessibilityLabel="Save"
              buttonStyle={[styles.button]}
            />
            <Button
              onPress={handleDelete}
              title="Delete"
              accessibilityLabel="Delete"
              buttonStyle={[styles.button, {backgroundColor: 'red'}]}
            />
          </>
        ) : (
          view === 'add' && (
            <>
              <Input
                label="name"
                value={name}
                onChangeText={(value) => handleChange('name', value)}
              />
              <Input
                label="avatar_url"
                value={avatar_url}
                onChangeText={(value) => handleChange('avatar_url', value)}
              />
              <Input
                label="subtitle"
                value={subtitle}
                onChangeText={(value) => handleChange('subtitle', value)}
              />
              <Button
                onPress={handleSubmit}
                title="Save"
                accessibilityLabel="Save"
                buttonStyle={[styles.button]}
              />
            </>
          )
        )}
      </ScrollView>

      {/* <View style={styles.content}>
        <Text style={styles.text}>Signed in successfully</Text>
        <Button
          onPress={signOut}
          style={styles.button}
          title="Sign Out"
          accessibilityLabel="Sign Out"
        />
      </View> */}
    </>
  );
}
