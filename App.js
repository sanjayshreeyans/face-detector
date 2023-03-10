import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import { MaterialIcons } from "@expo/vector-icons";
import Constants  from "expo-constants";
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  captureButton: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  checkIcon: {
    fontSize: 50,
    color: "green",
  },
});

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleFacesDetected = ({ faces }) => {
    if (faces.length > 0 && !faceDetected) {
      setFaceDetected(true);
      takePicture();
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setCapturedImage(data);
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setFaceDetected(false);
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.front}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
          minDetectionInterval: 1000,
          tracking: true,
        }}
        ref={cameraRef}
      />
      {capturedImage && (
        <TouchableOpacity style={styles.captureButton} onPress={reset}>
          <MaterialIcons name="check" style={styles.checkIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
}
