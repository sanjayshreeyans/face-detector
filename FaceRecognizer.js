import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import { MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import AWS from "aws-sdk";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import Config from "react-native-config";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#29335C",
  },
  camera: {
    height: "50%",
    width: "80%",
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: "20%",
    borderRadius: 10000,
    overflow: "hidden",
  },
  captureButton: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 140,
    height: 70,
    borderRadius: 50,
    backgroundColor: "#F3A712",
    marginTop: 50,
  },
  checkIcon: {
    fontSize: 50,
    color: "green",
  },
});
console.log("faceRecognizer.js");
export default function FaceRecognizer() {
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const cameraRef = useRef(null);
  const s3 = new AWS.S3({
    accessKeyId: "watermelon",
    secretAccessKey: "watermelon",
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

    // UNCOMMENT THIS TO UPLOAD TO S3


      s3.putObject(params, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`File uploaded successfully. ${data.Location}`);
          setCapturedImage(uri);
        }
      });
    
    // COMMENT THIS OUT TO UPLOAD TO S3
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setFaceDetected(false);
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          marginTop: 70,
          paddingVertical: 8,
          borderWidth: 4,
          borderColor: "#20232a",
          borderRadius: 6,
          backgroundColor: "#61dafb",
          color: "#20232a",
          textAlign: "center",
          fontSize: 30,
          width: "80%",
          alignSelf: "center",
          fontWeight: "bold",
        }}
      >
        Face Recognizer
      </Text>

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
