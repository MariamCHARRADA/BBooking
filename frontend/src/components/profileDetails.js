import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BaseUrl } from "../../config/config";
import { useFocusEffect } from "@react-navigation/native";

const logo = require("../../assets/avatar.png");

export default function ProfileDetails() {
  const [userData, setUserData] = useState(null);
  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [SalonN, setSalonN] = useState("");
  const [AddressS, setAddressS] = useState("");
  const [City, setCity] = useState("");

  const fetchUserData = async () => {
    const userDataString = await AsyncStorage.getItem("userData");
    if (userDataString) {
      const userDataJson = JSON.parse(userDataString);
      setUserData(userDataJson);
      setEmail(userDataJson.email);
      setName(userDataJson.username);
      setSalonN(userDataJson.salonName || "");
      setAddressS(userDataJson.address || "");
      setCity(userDataJson.city || "");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  const updateProfile = async () => {
    const userId = userData?._id;
    if (!userId) {
      Alert.alert("Error", "User ID not found");
      return;
    }

    const updateData = {
      email: Email,
      username: Name,
      salonName: SalonN,
      address: AddressS,
      city: City,
    };

    try {
      const response = await axios.put(
        `${BaseUrl}/api/users/updateUser/${userId}`,
        updateData
      );
      const updatedUserData = response.data;
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));
      setUserData(updatedUserData);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Update Failed", "Failed to update profile!");
    }
  };

  const deleteSalon = async () => {
    const userId = userData?._id;
    if (!userId) {
      Alert.alert("Error", "User ID not found");
      return;
    }

    try {
      await axios.delete(`${BaseUrl}/api/salons/deleteSalon/${userId}`);
      Alert.alert("Success", "Salon deleted successfully!");
      // Update local storage and state as needed
    } catch (error) {
      Alert.alert("Deletion Failed", "Failed to delete salon!");
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logoImage} />
        <Text style={styles.headerText}>{Name || "Your Name"}</Text>
      </View>
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={Email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={Name}
          onChangeText={setName}
        />
        {userData && userData.role === "owner" && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Name of the salon"
              value={SalonN}
              onChangeText={setSalonN}
            />
            <TextInput
              style={styles.input}
              placeholder="Address of the salon"
              value={AddressS}
              onChangeText={setAddressS}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={City}
              onChangeText={setCity}
            />
            <Button
              title="Delete Salon"
              onPress={deleteSalon}
              color="#ff0000"
            />
          </>
        )}
        <TouchableOpacity style={styles.updateButton} onPress={updateProfile}>
          <Text style={styles.updateButtonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  header: {
    alignItems: "center",
    backgroundColor: "#ff007f",
    paddingVertical: 40,
  },
  logoImage: {
    width: 110,
    height: 110,
    marginTop: 20,
    borderRadius: 100,
  },
  headerText: {
    fontSize: 30,
    fontFamily: "serif",
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",

  },
  content: {
    padding: 20,
    alignItems: "center",
    marginTop: 50
  },
  input: {
    height: 50,
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 15,
    marginVertical: 20,
    borderColor: "#ff007f",
    borderWidth: 1,
    fontSize: 16,
  },
  updateButton: {
    height: 50,
    width: '80%', // Adjust the width as needed
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff007f", // Pink color for the button
    borderRadius: 25, // Half of height to get a fully rounded button
    marginTop: 150, // Add some margin at the top
    shadowColor: "#ff007f", // Pink shadow to match the button
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
},

updateButtonText: {
    color: "#ffffff", // White text color
    fontSize: 18,
    fontWeight: 'bold',
}

});
