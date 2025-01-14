import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { GLView } from 'expo-gl';
import { Camera, useCameraPermissions } from 'expo-camera';

export default function HomeScreen() {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to access the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
      }
    })();
  }, []);

  const onContextCreate = (gl) => {
    // Initialize WebGL context
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    gl.viewport(0, 0, width, height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.endFrameEXP();
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={cameraRef}>
        <GLView style={styles.glview} onContextCreate={onContextCreate} />
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  glview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
  },
});