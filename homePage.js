import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
// import useNavigation from "@react-navigatio
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
export default function HomePage() { 
    const navigation = useNavigation();
    // Show two buttons, one for face registration and one for face recognition
    return (
      <LinearGradient
        // colors={["#5F93E4", "#4F68C4", "#333A5F"]}
        // colors={["#9D75CB", "#AAFFE5", "#5AFF15"]}
        colors={["#6E2594", "#4F68C4", "#6E2594"]}
        // colors={["#55286F", "#BC96E6", "#D8B4E2"]}
        // colors={["#2892D7", "#6DAEDB", "#1D70A2"]}
        // colors={["#F4D35E", "#EE964B", "#F95738"]}
        style={styles.container}
      >
        <Text
          style={{
            marginTop: 80,
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
            zIndex: 1000,
          }}
        >
          AttendAI
        </Text>

        <View style={{ height: 200 }} />
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("FaceRegistration")}
        >
          <Text style={styles.buttonText}>Register Face</Text>
        </TouchableOpacity>
        <View style={{ height: 20 }} />
        <TouchableOpacity
          style={styles.button2}
          onPress={() => navigation.navigate("FaceRecognizer")}
        >
          <Text style={styles.buttonText}>Recognize Face</Text>
        </TouchableOpacity>
      </LinearGradient>
    );

}

// Styles for the buttons
const styles = StyleSheet.create({
  container: {
    height: "80%",
    backgroundColor: "#29335C",
    alignItems: "center",
    flex: 1 
  },
  button: {
    backgroundColor: "#BA53BA",
    padding: 20,
    borderRadius: 5,
    margin: 10,
    width: "50%",
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
  },

  button2: {
    backgroundColor: "#F3A712",
    padding: 20,
    borderRadius: 5,
    margin: 10,
    width: "50%",
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    fontWeight: 600,
    justifyContent: "center",
    alignItems: "center",
  },
});
