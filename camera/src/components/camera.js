import React from 'react';
import {RNCamera} from 'react-native-camera';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {TouchableOpacity, Alert, StyleSheet} from 'react-native';

export default function Camera({onPicture}) {
  let camera;
  let isTakingPicture = false;
  
  async function takePicture() {
    if (camera && !isTakingPicture) {
      let options = {
        quality: 0.85,
        fixOrientation: true,
        forceUpOrientation: true,
      };

      isTakingPicture = true;

      try {
        const data = await camera.takePictureAsync(options);
        // Alert.alert('Success', JSON.stringify(data));
        onPicture(data);
      } catch (err) {
        Alert.alert('Error', 'Failed to take picture: ' + (err.message || err));
        return;
      } finally {
        isTakingPicture = false;
      }
    }
  }


  return (
    <RNCamera
      ref={(ref) => (camera = ref)}
      captureAudio={false}
      style={{flex: 1}}
      type={RNCamera.Constants.Type.back}
      androidCameraPermissionOptions={{
        title: 'Permission to use camera',
        message: 'We need your permission to use your camera',
        buttonPositive: 'Ok',
        buttonNegative: 'Cancel',
      }}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.btnAlignment}
        onPress={takePicture}>
        <Icon name="camera" size={50} color="#fff" />
      </TouchableOpacity>
    </RNCamera>
  );
}

const styles = StyleSheet.create({
  btnAlignment: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
});
