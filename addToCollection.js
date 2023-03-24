import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons"
import AWS from "aws-sdk";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import Config from "react-native-config";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";
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
    marginTop: "10%",
    borderRadius: 10000,
    overflow: "hidden",
  },
  camera2: {
    height: "50%",
    width: "80%",
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: "10%",
    borderRadius: 100,
    overflow: "hidden",
  },
  captureButton: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "white",
    marginTop: 50,
  },
  checkIcon: {
    fontSize: 50,
    color: "green",
  },
  xIcon: {
    fontSize: 50,
    color: "red",
  },
});
console.log("FaceRegistration.js");
export default function FaceRegistration() {
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [showCheckMark, setShowCheckMark] = useState(false);
  const [showXMark, setShowXMark] = useState(false);
  const [showCaptureBtn, setshowCaptureBtn] = useState(true);
const navigation = useNavigation();

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

      // s3.putObject(params, (err, data) => {
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     console.log(`File uploaded successfully. ${data.Location}`);
      //     setCapturedImage(uri);
      //   }
      // });
      
      // COMMENT THIS OUT TO UPLOAD TO S3

      setCapturedImage(uri);
      setShowCheckMark(true);
      setShowXMark(true);
      setshowCaptureBtn(false);
      console.log("Finished taking picture");
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setFaceDetected(false);
    setShowCheckMark(false);
    setShowXMark(false);
    setshowCaptureBtn(true);
  };

  const checkMarkClicked = () => {
    console.log("Check mark clicked");
    navigation.navigate("UploadToRekognition", {
      imageToBeGiven: capturedImage,
    });
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
          backgroundColor: "#BDF7B7",
          color: "#20232a",
          textAlign: "center",
          fontSize: 30,
          width: "80%",
          alignSelf: "center",
          fontWeight: "bold",
        }}
      >
        Face Registration
      </Text>

      {showCaptureBtn && (
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          ref={cameraRef}
        />
      )}

      {!showCaptureBtn && (
        <Image source={{ uri: capturedImage }} style={styles.camera2}></Image>
      )}

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {showCheckMark && (
          <TouchableOpacity
            style={{
              width: 100,
              height: 100,
              paddingTop: 30,
              paddingLeft: 30,
            }}
            onPress={() => {
              checkMarkClicked();
            }}
          >
            <MaterialIcons name="check" style={styles.checkIcon} />
          </TouchableOpacity>
        )}

        {showCaptureBtn && (
          <TouchableOpacity
            style={styles.captureButton}
            onPress={() => takePicture()}
          ></TouchableOpacity>
        )}

        {showXMark && (
          <TouchableOpacity
            style={{ width: 100, height: 100, paddingTop: 30, paddingLeft: 30 }}
            onPress={() => {
              reset();
            }}
          >
            <MaterialIcons name="close" style={styles.xIcon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
