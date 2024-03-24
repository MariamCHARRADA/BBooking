import React, { useEffect, useState } from "react";
import {
  Image,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { BaseUrl } from "../../config/config";
import Checkbox from "expo-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import SalonPhoto from "./salonPhoto";
import * as ImagePicker from "expo-image-picker";
const logo = require("../../assets/logo3.png");
const facebook = require("../../assets/facebook.png");
const instagram = require("../../assets/instagram.png");
const google = require("../../assets/google.png");

export default function RegisterForm() {
  const navigation = useNavigation();
  const [checkedItems, setCheckedItems] = useState({});
  const [modalVisible1, setModalVisible1] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [services, setServices] = useState([]);
  const [SalonN, setSalonN] = useState("");
  const [AddressS, setAddressS] = useState("");
  const [openTime, setOpenTime] = useState(new Date());
  const [closeTime, setCloseTime] = useState(new Date());
  const [showOpenPicker, setShowOpenPicker] = useState(false);
  const [showClosePicker, setShowClosePicker] = useState(false);
  const [ServicesAction, setServicesAction] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [image, setImage] = useState(null);

  const onOpenTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || openTime;
    setShowOpenPicker(!showOpenPicker);
    setOpenTime(currentDate);
    console.log(currentDate, "open");
  };

  const onCloseTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || closeTime;
    setShowClosePicker(!showClosePicker);
    setCloseTime(currentDate);
    console.log(currentDate, "close");
  };

  const showOpenTimepicker = () => {
    setShowOpenPicker(!showOpenPicker);
  };

  const showCloseTimepicker = () => {
    setShowClosePicker(!showClosePicker);
  };
  const handleCheckBoxChange = (serviceId) => {
    setCheckedItems((prevState) => {
      const updatedState = { ...prevState };
      if (updatedState[serviceId]) {
        delete updatedState[serviceId];
      } else {
        updatedState[serviceId] = true;
      }
      setServicesAction(updatedState);
      return updatedState;
    });
  };
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        alert("Permission to access media library is required!");
      }
    })();
  }, []);
  const pickImage = async (source) => {
    let result;
    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        aspect: [1, 1],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [1, 1],
        quality: 1,
      });
    }

    console.log("Image picker result:", result);

    if (!result.canceled) {
      console.log("Image URI:", result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };
  const handleRegister = async () => {
    try {
      setModalVisible1(true);
      const response = await axios.post(`${BaseUrl}/api/users/register`, {
        email: email,
        password: password,
        role: role,
        username: username,
      });
      let user = await response.data;
      if (response.data) {
        if (role === "owner") {
          try {
            const selectedServiceIds = Object.keys(ServicesAction).filter(
              (serviceId) => ServicesAction[serviceId]
            );
            console.log(selectedServiceIds);
            const formData = new FormData();
            if (image) {
              const uriParts = image.split(".");
              let fileName =
                uriParts[uriParts.length - 2] +
                "." +
                uriParts[uriParts.length - 1];
              const fileType =
                fileName.split(".")[fileName.split(".").length - 1];
              formData.append("image", {
                uri: image,
                name: fileName,
                type: `image/${fileType}`,
              });
            }
            formData.append("User", user.user._id);
            formData.append("Name", SalonN);
            formData.append("Address", AddressS);
            formData.append("City", selectedCity);
            formData.append("Open", openTime.getTime());
            formData.append("Close", closeTime.getTime());
            selectedServiceIds.forEach((serviceId) => {
              formData.append("Services[]", serviceId);
            });

            const response = await axios.post(
              `${BaseUrl}/api/salons/createSalon`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            const salon = await response.data;
            console.log(salon);
            setModalVisible1(false);

            navigation.navigate("Login");
          } catch (error) {
            setModalVisible1(false);

            console.log(error);
          }
        } else {
          setModalVisible1(false);

          navigation.navigate("Login");
        }
      } else {
        setModalVisible1(false);

        console.log("Login failed: ", response.data);
      }
    } catch (error) {
      setModalVisible1(false);

      console.log("Error occurred while logging in: ", error);
    }
  };
  const getServices = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/api/services/getServices`);
      setServices(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getCities = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/api/cities/getCities`);
      setCities(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getServices();
    getCities();
    console.log(ServicesAction);
  }, [ServicesAction]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.Scroll}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.image} resizeMode="cover" />
        </View>
        <Text style={styles.headerText}>Create your account :</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCorrect={false}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
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
        <View style={styles.BlockRole}>
          <Text style={styles.inputLabelRole}>Select Role:</Text>
          <View style={styles.roleSelectionBlock}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === "client" ? styles.selectedRoleButton : null,
              ]}
              onPress={() => setRole("client")}
            >
              <Text
                style={
                  role === "client"
                    ? styles.roleButtonTextActive
                    : styles.roleButtonText
                }
              >
                Client
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === "owner" ? styles.selectedRoleButton : null,
              ]}
              onPress={() => setRole("owner")}
            >
              <Text
                style={
                  role === "owner"
                    ? styles.roleButtonTextActive
                    : styles.roleButtonText
                }
              >
                Salon Owner
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {role === "owner" ? (
          <View style={styles.blockOwner}>
            <Text style={styles.inputLabel}>Create Salon:</Text>
            <View style={styles.roleSelection}>
              <TouchableOpacity style={[styles.roleButton]}>
                <Text
                  style={styles.selectImageText}
                  onPress={() => pickImage("camera")}
                >
                  Open Camera
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.roleButton]}>
                <Text
                  style={styles.selectImageText}
                  onPress={() => pickImage("Library")}
                >
                  Select Image
                </Text>
              </TouchableOpacity>
            </View>
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.ImageV}
                resizeMode="cover"
              />
            ) : null}
            <View styles={styles.roleSelectionInput}>
              <TextInput
                style={styles.input1}
                placeholder="Name of the salon"
                value={SalonN}
                onChangeText={setSalonN}
                autoCorrect={false}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input1}
                placeholder="Address"
                value={AddressS}
                onChangeText={setAddressS}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>

            <Picker
              style={styles.inputPicker}
              selectedValue={selectedCity}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedCity(itemValue)
              }
            >
              <Picker.Item label="Select City" value="" />
              {cities.map((city) => (
                <Picker.Item
                  label={city.Name}
                  value={city._id}
                  key={city._id}
                />
              ))}
            </Picker>

            <View style={styles.Times}>
              <View style={styles.picker}>
                <TouchableOpacity
                  style={[styles.TimeButtonOpen]}
                  onPress={showOpenTimepicker}
                >
                  <Text style={styles.timeText}>OPEN TIME</Text>
                </TouchableOpacity>
                <Text>{openTime.toLocaleTimeString()}</Text>
                {showOpenPicker && (
                  <DateTimePicker
                    value={openTime}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onOpenTimeChange}
                  />
                )}
              </View>
              <View style={styles.picker}>
                <TouchableOpacity
                  style={[styles.TimeButtonClose]}
                  onPress={showCloseTimepicker}
                >
                  <Text style={styles.timeText}>CLOSE TIME</Text>
                </TouchableOpacity>
                <Text>{closeTime.toLocaleTimeString()}</Text>
                {showClosePicker && (
                  <DateTimePicker
                    value={closeTime}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onCloseTimeChange}
                    />
                )}
              </View>
            </View>
            <Text style={styles.inputLabel}>Salon Services:</Text>
            <View style={styles.section}>
              <FlatList
                data={services}
                keyExtractor={(item) => item._id}
                numColumns={7}
                scrollEnabled={false}
                renderItem={(post) => {
                  const item = post.item;
                  return (
                    <View style={styles.row} key={item._id}>
                      <Checkbox
                        style={styles.checkbox}
                        value={checkedItems[item._id] || false}
                        onValueChange={() => handleCheckBoxChange(item._id)}
                        color={checkedItems ? "#ff007f" : undefined}
                      />
                      <Text style={styles.paragraph}>{item.Name}</Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        ) : null}

        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>REGISTER</Text>
          </TouchableOpacity>
          <Text style={styles.optionsText}>OR REGISTER WITH</Text>
        </View>

        <View style={styles.mediaIcons}>
          <Image source={facebook} style={styles.icons} />
          <Image source={instagram} style={styles.icons} />
          <Image source={google} style={styles.icons} />
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already Have an Account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.signup}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        style={{ justifyContent: "center", alignItems: "center" }}
        animationType="slide"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={() => {
          console.log("Modal has been closed.");
          setModalVisible1(!modalVisible1);
        }}
      >
        <View style={styles.containerModal}>
          <Text style={styles.labelModal}>
            Registration in progress. Please wait...
          </Text>
          <ActivityIndicator size="large" color="#ff007f" />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  selectImageText: {
    fontWeight: "bold",
  },
  timeText: {
    color: "white",
    fontWeight: "bold",
  },
  containerModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  labelModal: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "white",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 30,
  },
  roleSelectionImage: {},
  Scroll: {
    alignItems: "center",
  },
  ViewImg: {
    width: 200,
    height: 200,
    alignItems: "center",
  },
  ImageV: {
    width: "80%",
    height: 200,
    alignSelf: "center",
    marginBottom: 10,
    borderRadius: 20,
  },
  buttonView: {
    width: "100%",
  },
  blockOwner: {
    width: "100%",
  },
  BlockRole: {
    width: "100%",
  },
  picker: {
    alignItems: "center",
  },
  Times: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "10%",
  },

  // CHECKBOX
  paragraph: {
    margin: 2,
    fontSize: 12,
    color: "#333333",
  },
  checkbox: {
    height: 25,
    width: 25,
    borderRadius: 5,
  },
  section: {
    marginBottom: 20,
    marginTop: 5,
    alignItems: "center",
  },
  row: {
    alignItems: "center",
    marginLeft: 3,
  },

  logoContainer: {
    marginTop: 50,
  },
  container: {
    backgroundColor: "#fafafa",
    flex: 1,
  },
  image: {
    width: 250,
    height: 220,
    marginTop: 20,
  },
  headerText: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
  mediaIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  icons: {
    width: 50,
    height: 50,
  },
  inputView: {
    alignItems: "center",
    marginBottom: 20,
    width: "16%",
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: "#ff007f",
    borderWidth: 1,
    borderRadius: 7,
    width: "500%",
    marginBottom: 10,
  },
  input1: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: "#ff007f",
    width: "80%",

    borderWidth: 1,
    borderRadius: 7,
    marginBottom: 10,
    alignSelf: "center",
  },
  inputPicker: {
    borderColor: "#ff007f",
    borderWidth: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 700,
    marginBottom: 10,
    overflow: "hidden",
    width: "80%",
    alignSelf: "center",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: "10%",
  },
  inputLabelRole: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: "10%",
  },
  roleSelection: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "10%",
  },
  roleSelectionBlock: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "10%",
  },
  roleButton: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ff007f",
    borderWidth: 1,
    borderRadius: 5,
    width: "48%",
    height: 40,
  },
  TimeButtonOpen: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    width: "100%",
    height: 40,
    padding: 10,
    backgroundColor: "rgba(100, 200, 44, 0.7)", // Light green with low opacity
    paddingHorizontal: 20,
  },
  TimeButtonClose: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    height: 40,
    padding: 10,
    backgroundColor: "rgba(245, 0, 0, 0.7)",
    paddingHorizontal: 20,
  },
  selectedRoleButton: {
    backgroundColor: "#ff007f",
  },
  roleButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  roleButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#ff007f",
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    width: "80%",
    justifyContent: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
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
  footerText: {
    textAlign: "center",
    color: "gray",
    alignItems: "center",
    justifyContent: "center",
  },
  signup: {
    color: "#ff007f",
    fontSize: 13,
  },
});
