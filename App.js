import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import { MaterialIcons } from "@expo/vector-icons";
import Constants  from "expo-constants";
import AWS from "aws-sdk";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import Config from "react-native-config";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";
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
const s3 = new AWS.S3({
  accessKeyId: "AKIA5KTQWF6JJLZC35MX",
  secretAccessKey: "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",
  region: "us-east-1",
});
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
      const { uri, base64 } = await cameraRef.current.takePictureAsync(options);

      // Convert base64-encoded image to PNG file
      const fileUri = `${FileSystem.documentDirectory}${Date.now()}.png`;
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Upload PNG file to S3
      const key = `${Date.now()}.png`;
      const fileBuffer = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const params = {
        Bucket: "sanjays3-image-database",
        Key: key,
        Body: Buffer.from(fileBuffer, "base64"),
        ContentType: "image/png",
      };
      s3.putObject(params, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`File uploaded successfully. ${data.Location}`);
          setCapturedImage(uri)
        }
      });
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
          mode: FaceDetector.FaceDetectorMode.accurate,
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
