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
import { useNavigation } from "@react-navigation/native";

const logo = require("../../assets/avatar.png");

export default function ProfileDetails({ route }) {
  const { userId } = route.params;
  const navigation = useNavigation();

  const [userData, setUserData] = useState(null);
  const [Email, setEmail] = useState(userId.email);
  const [Name, setName] = useState(userId.username);
  const [SalonN, setSalonN] = useState("");
  const [AddressS, setAddressS] = useState("");
  const [SalonId, setSalonId] = useState("");
  useEffect(() => {
    const fetchSalonDetails = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/api/salons/getUserSalon/${userId?._id}`);
        const salonData = response.data;
        setSalonN(salonData[0].Name);
        setAddressS(salonData[0].Address);
        setSalonId(salonData[0]._id);
      } catch (error) {
        console.error("Error fetching salon details:", error);
      }
    }; 

    if (userId.role === "owner") {
      fetchSalonDetails();
  


    }
  }, [userId]);

  const updateProfile = async () => {
    const userId1 = userId?._id;
    if (!userId1) {
      Alert.alert("Error", "User ID not found");
      return;
    }

    const updateData = {
      email: Email,
      username: Name,
     
    };
    const updateSalonData = {
      Name: SalonN,
      Address: AddressS,
     
    };
    try {
      const response = await axios.put(
        `${BaseUrl}/api/users/updateUser/${userId1}`,
        updateData
      );
      const updatedUserData = response.data;
      console.log(updatedUserData,"fdfsd")
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));
      if (updatedUserData){
        if(updatedUserData.role === "owner"){
          const responseSalon = await axios.put(
            `${BaseUrl}/api/salons/updateSalon/${SalonId}`,
            updateSalonData
          );
          console.log("fgdhjk")
        }
      }

      Alert.alert("Success", "Profile updated successfully!");

      navigation.navigate("Account");

    } catch (error) {
      Alert.alert("Update Failed", "Failed to update profile!");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logoImage} />
        <Text style={styles.headerText}>{Name || "Your Name"}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Email :</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={Email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Username :</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={Name}
          onChangeText={setName}
        />
        {userId && userId.role === "owner" && (
          <>
            <Text style={styles.label}>Salon name :</Text>

            <TextInput
              style={styles.input}
              placeholder="Name of the salon"
              value={SalonN}
              onChangeText={setSalonN}
            />
            <Text style={styles.label}>Address :</Text>

            <TextInput
              style={styles.input}
              placeholder="Address of the salon"
              value={AddressS}
              onChangeText={setAddressS}
            />
          </>
        )}
        <TouchableOpacity style={styles.updateButton} onPress={updateProfile}>
          <Text style={styles.updateButtonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  header: {
    alignItems: "center",
    backgroundColor: "#ff007f",
    paddingVertical: 40,
    height: 230
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
  label: {
    alignSelf: "flex-start",
    marginLeft: "7.5%", // Align with the input fields
    color: "#000",
    fontSize: 16,
  },
  content: {
    padding: 20,
    alignItems: "center",
    marginTop: 20,
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
    width: "80%", // Adjust the width as needed
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff007f", // Pink color for the button
    borderRadius: 25, // Half of height to get a fully rounded button
    marginVertical: 50, // Add some margin at the top
    shadowColor: "#ff007f", // Pink shadow to match the button
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },

  updateButtonText: {
    color: "#ffffff", // White text color
    fontSize: 18,
    fontWeight: "bold",
  },
});
