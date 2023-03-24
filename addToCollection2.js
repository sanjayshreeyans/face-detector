import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as FileSystem from 'expo-file-system';
import AWS from "aws-sdk";
import { Buffer } from "buffer";
// import useNavigation from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

// import useRoute from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';


export default function UploadToRekognition() {
  const [name, setName] = useState('');
  const [imageUri, setImageUri] = useState(null);

    const navigation = useNavigation();
    const route = useRoute();

  // Set up AWS SDK configuration a
  const rekognition = new AWS.Rekognition({
    accessKeyId: "AKIA5KTQWF6JJLZC35MX",
    secretAccessKey: "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",
    region: "us-east-1",
  });


  const uploadToRekognition = async () => {
    // check if external image id matches this regular expression
    // [a-zA-Z0-9_.\-:]+
    if (!name.match(/^[a-zA-Z0-9_.\-:]+$/)) {
        alert('Name can only contain alphanumeric characters, hyphens, underscores, colons and periods');
        return;
    }


    try {
      // Read image file and convert it to binary data
      const imgData = await FileSystem.readAsStringAsync(
        route.params.imageToBeGiven,
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );


    
      // Upload image to the face collection and set name as external ID
      await rekognition
        .indexFaces({
          CollectionId: "doc-example-collection-demo",
          Image: {
            Bytes: Buffer.from(imgData, "base64"),
          },
          ExternalImageId: name,
          DetectionAttributes: ["DEFAULT"],
          MaxFaces: 1,
          QualityFilter: "AUTO",
        })
        .promise();

      // Reset name and image state after successful upload
      setName('');
      setImageUri(null);
      alert('Image uploaded successfully');

      const dynamodb = new AWS.DynamoDB({
        accessKeyId: "AKIA5KTQWF6JJLZC35MX",
        secretAccessKey: "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",
        region: "us-east-1",
      });

      // Put item in DynamoDB table
      
        const params = {
          TableName: "computerclassattendance",
          Item: {
            studentname: { S: name }
          },
        };

        try {
          await dynamodb.putItem(params).promise();
          console.log("Successfully added item to DynamoDB table");
        } catch (error) {
          console.log("Error adding item to DynamoDB table:", error);
        }
      


    } catch (error) {
      console.log(error);
      alert('Failed to upload image');
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: "#F4D35E" }}>
      <Text
        style={{
          marginTop: 40,
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

      <Image
        source={{ uri: route.params.imageToBeGiven }}
        style={{
          height: "50%",
          width: "80%",
          alignSelf: "center",
          alignContent: "center",
          justifyContent: "center",
          marginTop: "10%",
          borderRadius: 100,
          overflow: "hidden",
        }}
      />

      <TextInput
        style={{
    ...Platform.select({
      ios: {
        height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    width: 350,

    alignSelf: "center",
      },
      android: {
        height: 40,
    margin: 12,
    borderWidth: 1,
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    width: 350,
      },
      default: {
        height: 40,
    margin: 12,
    borderWidth: 1,
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    width: 400,

    alignSelf: "center",
      }
    })
  }}
        onChangeText={(text) => setName(text)}
        value={name}
        placeholder="Enter your name:"
      />
      <TouchableOpacity
        style={{
          backgroundColor: "#9883E5",
          padding: 20,
          borderRadius: 5,
          margin: 10,
          width: "50%",
          height: "10%",
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => uploadToRekognition()}
      >
        <Text
          style={{
            fontSize: 20,
            color: "#fff",
            textAlign: "center",
            fontWeight: 600,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Upload Face
        </Text>
      </TouchableOpacity>
    </View>
  );
    }
    //     return (
