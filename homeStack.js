import { createStackNavigator } from "@react-navigation/stack";
// import button from rn
import { Button } from "react-native";
import FaceRecognizer from "./FaceRecognizer";
import FaceRegistration from "./addToCollection";
import HomePage from "./homePage";
import UploadToRekognition from "./addToCollection2";
console.log("homeStack.js");
const Navigator = createStackNavigator();
import { NavigationContainer } from "@react-navigation/native";
const App = () => {
  return (
    <NavigationContainer>
      {/* //screenOptions={{ headerShown: false }} */}
      <Navigator.Navigator>
        {/* // Demo Screen */}
        {/* <Navigator.Screen name="demoScreen" component={demoScreen} options={{ title: 'Home', headerShown: false }} /> */}
        {/* // Home Page */}
        <Navigator.Screen
          name="HomePage"
          component={HomePage}
          options={{ title: "Home", headerShown: false }}
        />
        {/* // Face Registration */}
      
        <Navigator.Screen
          name="FaceRecognizer"
          component={FaceRecognizer}
          options={({ navigation }) => ({
            headerTitle: "Face Recognizer",
            headerRight: () => (
              <Button onPress={() => navigation.goBack()} title="Back" />
            ),
          })}
        />

        <Navigator.Screen
          name="FaceRegistration"
          component={FaceRegistration}
          options={({ navigation }) => ({
            headerTitle: "Face Registration",
            headerRight: () => (
              <Button onPress={() => navigation.goBack()} title="Back" />
            ),
          })}
        />

        <Navigator.Screen
          name="UploadToRekognition"
          component={UploadToRekognition}
          options={({ navigation }) => ({
            headerTitle: "Upload to Rekognition",
            headerRight: () => (
              <Button onPress={() => navigation.goBack()} title="Back" />
            ),
          })}
        />

      </Navigator.Navigator>
    </NavigationContainer>
  );
};

export default App;
