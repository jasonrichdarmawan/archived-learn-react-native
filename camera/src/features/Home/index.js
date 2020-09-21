import React from 'react';
import Camera from '../../components/camera';
import {SafeAreaView, TouchableHighlight, Image} from 'react-native';

export default function Home() {
  const [img, setImg] = React.useState(null);

  function onPicture({uri}) {
    setImg(uri);
  }

  function onBackToCamera() {
    console.log('omg')
    setImg(null);
  }

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        {img ? (
          <TouchableHighlight
            style={{flex: 1}}
            onPress={onBackToCamera}
          >
            <Image source={{uri: img}} style={{flex: 1}} />
          </TouchableHighlight>
        ) : (
          <Camera onPicture={onPicture} />
        )}
      </SafeAreaView>
    </>
  );
}
