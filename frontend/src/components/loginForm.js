import React, { useState } from "react";
import {
  Alert,
  TouchableOpacity,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { BaseUrl } from "../../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
const logo = require("../../assets/logo3.png");
const facebook = require("../../assets/facebook.png");
const instagram = require("../../assets/instagram.png");
const google = require("../../assets/google.png");

export default function LoginForm() {
  const navigation = useNavigation();
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BaseUrl}/api/users/login`, {
        email: username,
        password: password,
      });

      if (response.data) {
        const { accessToken, user } = response.data;

        console.log(user);
        await AsyncStorage.setItem("userData", JSON.stringify(user));

        navigation.navigate("Acceuil");
      } else {
        // Handle unsuccessful login (e.g., display error message)
        console.log("Login failed: ", response.data.message);
      }
    } catch (error) {
      // Handle errors (e.g., network errors)

      console.log("Error occurred while logging in: ", error.message);
    }
  };

  return (
    <View style={styles.container1}>
      <SafeAreaView style={styles.container}>
        <Image source={logo} style={styles.image} resizeMode="contain" />
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            placeholder="Email/Username"
            value={username}
            onChangeText={setUsername}
            autoCorrect={false}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.rememberView}>
          <View style={styles.switch}>
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              trackColor={{ true: "black", false: "#767577" }}
            />
            <Text style={styles.rememberText}>Stay Signed In</Text>
          </View>
          <Pressable onPress={() => Alert.alert("Forget Password!")}>
            <Text style={styles.forgetText}>Forgot Password?</Text>
          </Pressable>
        </View>

        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
          <Text style={styles.optionsText}>OR LOGIN WITH</Text>
        </View>

        <View style={styles.mediaIcons}>
          <Image source={facebook} style={styles.icons} />
          <Image source={instagram} style={styles.icons} />
          <Image source={google} style={styles.icons} />
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't Have an Account? </Text>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.signup}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container1: {
    backgroundColor: "#fafafa",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  image: {
    height: "25%",
    width: "100%",
  },
  inputView: {
    gap: 15,
    width: "100%",
    paddingHorizontal: 40,
    marginBottom: 5,
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: "#ff007f",
    borderWidth: 1,
    borderRadius: 7,
  },
  rememberView: {
    width: "100%",
    paddingHorizontal: 50,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 8,
  },
  switch: {
    flexDirection: "row",
    gap: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rememberText: {
    fontSize: 13,
  },
  forgetText: {
    fontSize: 11,
    color: "#ff007f",
  },
  button: {
    backgroundColor: "#ff007f",
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonView: {
    width: "100%",
    paddingHorizontal: 50,
  },
  optionsText: {
    textAlign: "center",
    paddingVertical: 10,
    color: "gray",
    fontSize: 13,
    marginBottom: 6,
  },
  mediaIcons: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 23,
  },
  icons: {
    width: 40,
    height: 40,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 30,
  },
  footerText: {
    color: "gray",
  },
  signup: {
    color: "#ff007f",
    fontSize: 13,
  },
});
