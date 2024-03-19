import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Image,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

import axios from "axios";
import { BaseUrl } from "../../config/config";
import moment from "moment";

const MyReservations = ({ route }) => {
  const { userId } = route.params;
  const [Reserv, setReserv] = useState([]);
  const navigation = useNavigation();

  const fetchSalons = async () => {
    try {
      const response = await axios.get(
        `${BaseUrl}/api/reservations/getUserReservation/user/${userId}`
      );
      setReserv(response.data);
    } catch (error) {
      console.error("Error fetching salons:", error);
    }
  };

  useEffect(() => {
    fetchSalons();
  }, []);

  const deleteReservation = async (reservationId) => {
    try {
      await axios.delete(
        `${BaseUrl}/api/reservations/deleteReservation/${reservationId}`
      );
      fetchSalons();
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };
  const handleDeleteReservation = (reservationId) => {
    Alert.alert(
      "Cancel Reservation",
      "Are you sure you want to cancel this reservation?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => deleteReservation(reservationId),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Reservations</Text>
      <FlatList
        data={Reserv}
        numColumns={3}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleDeleteReservation(item._id)}
          >
            <Text style={styles.cardText}>
              {item.Salon.Name} - {item.Service.Name}
            </Text>
            <Text style={styles.cardText}>
              {moment(item.Date).format("YYYY-MM-DD")} - {item.Time}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontFamily: "serif",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 40,
  },
  card: {
    flex: 1,
    margin: 5,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 3,
    backgroundColor: "#fff",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 110,
  },
  cardText: {
    padding: 10,
    textAlign: "center",
    fontSize: 11,
    fontFamily: "serif",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff4f2",
    paddingHorizontal: 30,
    paddingTop: 100,
    justifyContent: "space-between",
  },
});

export default MyReservations;
