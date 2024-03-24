import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
} from "react-native";
import axios from "axios";
import { BaseUrl } from "../../config/config";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SalonDetail({ route }) {
  const { salonID } = route.params;
  const [salon, setSalon] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchSalonDetailsAndServices = async () => {
      try {
        const response = await axios.get(
          `${BaseUrl}/api/salons/getSalon/${salonID}`
        );
        setSalon(response.data);
        setServices(response.data.Services); // Assuming services are included in the salon details
      } catch (error) {
        console.error("Error fetching salon details:", error);
      }
    };

    fetchSalonDetailsAndServices();
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        const UserData1 = JSON.parse(userData);
        setUserData(UserData1);
      } catch (e) {
        console.log("error fetching user data", e);
      }
    };

    fetchUserData();
  }, [salonID]);

  const onDaySelect = async (day) => {
    const dateString = moment(day.dateString).format("YYYY-MM-DD");
    setSelectedDate(dateString);

    try {
      const response = await axios.get(
        `${BaseUrl}/api/reservations/${salonID}/availability`,
        {
          params: { date: dateString },
        }
      );
      console.log(response.data);
      const slots = response.data.slots;
      if (slots && slots.length > 0) {
        setAvailableTimes(slots);
        setShowTimeModal(true);
      } else {
        console.error("No slots available or error fetching slots");
      }
    } catch (error) {
      console.error("Error fetching available times:", error);
    }
  };

  const onTimeSelect = (time) => {
    setSelectedTime(time);
    setShowTimeModal(false);
    setShowServiceModal(true);
  };

  const onServiceSelect = (service) => {
    setSelectedService(service);
  };

  const createReservation = async () => {
    try {
      const response = await axios.post(
        `${BaseUrl}/api/reservations/createReservation`,
        {
          Date: selectedDate,
          Time: selectedTime,
          Service: selectedService._id,
          Salon: salonID,
          User: userData._id,
        }
      );

      console.log("Reservation created:", response.data);

      setSelectedTime(null);
      setSelectedService(null);
      setShowServiceModal(false);
    } catch (error) {
      console.error("Error creating reservation:", error);
    }
  };
  useEffect(() => {
    console.log("Available times updated:", availableTimes);
  }, [availableTimes]);
  const openingTime = moment(salon.Open).format("HH:mm");
  const closingTime = moment(salon.Close).format("HH:mm");

  // Get the current time
  const currentTime = moment().format("HH:mm");

  // Check if the current time is within the opening hours
  const isOpenNow = currentTime >= openingTime && currentTime <= closingTime;
  return (
    <View style={styles.container}>
      <ScrollView>
        <Image
          source={{ uri: `${BaseUrl}/${salon.Photo}` }}
          style={styles.salonImage}
        />
        <View style={styles.salonInfo}>
          <Text style={styles.salonName}>{salon.Name}</Text>

          <View style={styles.firstBlock}>
            <View style={styles.services}>
              <Text style={styles.salonAddress}>{salon.Address}</Text>
              <FlatList
                data={salon.Services}
                scrollEnabled={false}
                numColumns={3}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={styles.serviceCard}>
                    <Text>#{item.Name}</Text>
                  </View>
                )}
              />
            </View>
            <View style={styles.DateBlock}>
              <View style={[isOpenNow ? styles.StatusOpen : styles.Status]}>
                <Text style={{ color: "white" }}>
                  {isOpenNow ? "Open" : "Closed"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Calendar
          onDayPress={onDaySelect}
          markedDates={{
            [moment(selectedDate).format("YYYY-MM-DD")]: { selected: true },
          }}
          theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#b6c1cd",
            textSectionTitleDisabledColor: "#d9e1e8",
            selectedDayBackgroundColor: "#ec407a",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#ff4081",
            dayTextColor: "#2d4150",
            textDisabledColor: "#d9e1e8",
            dotColor: "#00adf5",
            selectedDotColor: "#ffffff",
            arrowColor: "pink",
            disabledArrowColor: "#d9e1e8",
            monthTextColor: "#ec407a",
            indicatorColor: "blue",
            textDayFontWeight: "500",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "500",
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16,
          }}
        />
        <View style={styles.OpenTimesSalon}>
          <View style={styles.Opp}>
            <Text style={styles.TextOpen}>Open Time : </Text>
            <Text style={styles.TextOpen}>{openingTime} </Text>
          </View>

          <View style={styles.Cll}>
            <Text style={styles.TextOpen}>Close Time : </Text>
            <Text style={styles.TextOpen}>{closingTime}</Text>
          </View>
        </View>
        <Modal
          visible={showTimeModal}
          onRequestClose={() => setShowTimeModal(false)}
          animationType="slide"
          transparent={true} // Make the modal transparent to see the background
        >
          <View style={styles.modalView}>
            <FlatList
              numColumns={4}
              data={availableTimes}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.timeSlot,
                    !item.isAvailable && styles.timeSlotDisabled,
                  ]}
                  onPress={() => item.isAvailable && onTimeSelect(item.time)}
                  disabled={!item.isAvailable}
                >
                  <Text>{item.time}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>

        <Modal
          visible={showServiceModal}
          onRequestClose={() => setShowServiceModal(false)}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalView}>
            <FlatList
              numColumns={4}
              data={services}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.serviceItem}
                  onPress={() => onServiceSelect(item)}
                >
                  <Text>{item.Name}</Text>
                </TouchableOpacity>
              )}
            />
            <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
              {selectedService && (
                <TouchableOpacity
                  onPress={createReservation}
                  style={styles.bookButton}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Book Now
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  TextOpen: {
    fontSize: 15,
    fontFamily: "serif",
  },
  Opp: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    justifyContent: "space-between",
  },
  Cll: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  OpenTimesSalon: {
    paddingHorizontal: 50,
    marginTop: 25,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 20,
    marginHorizontal: 70,
    borderColor: "#f8bbd0",
  },
  ViewSer: {
    flexDirection: "row",
    width: 50,
  },
  salonAddress: {
    fontSize: 16,
  },
  serviceCard: {
    backgroundColor: "white",
    borderRadius: 5,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    marginVertical: 5,
  },
  salonName: {
    alignSelf: "center",
    fontSize: 25,
    fontFamily: "serif",
    paddingVertical: 20,
  },
  container: {
    backgroundColor: "#fafafa",
    flex: 1,
  },
  salonImage: {
    width: "100%",
    height: 250,
    marginBottom: 10,
  },
  firstBlock: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f8bbd0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 20,
    marginHorizontal: 15,
  },
  services: {},
  DateBlock: {
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  Status: {
    backgroundColor: "#f06292", // Pink shade for closed status
    borderRadius: 20,
    width: 80,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  StatusOpen: {
    backgroundColor: "#ff80ab", // Lighter pink for open status
    borderRadius: 20,
    width: 80,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  timeSlot: {
    padding: 10,
    backgroundColor: "#fff", // Pink shade for available slots
    margin: 5,
    borderRadius: 10,
  },
  timeSlotDisabled: {
    backgroundColor: "gray", // Light pink for disabled slots
    borderWidth: 1,
    borderColor: "#fff",
  },
  serviceItem: {
    padding: 10,
    backgroundColor: "#ff80ab", // Dark pink for service items
    margin: 5,
    borderRadius: 10,
  },
  bookButton: {
    backgroundColor: "#ec407a", // Consistent pink shade for action buttons
    borderRadius: 20,
    width: 250,
    height: 50,
    alignItems: "center",
    alignSelf: "center",
    shadowOffset: { width: 3, height: 3 },
    elevation: 5,
    padding: 10,
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "rgba(000, 000, 000, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: "100%", // Position the modal in the middle of the screen vertically
    width: "80%", // Width of the modal is 80% of the screen width
    height: 300,
    borderRadius: 20,
    padding: 20,
  },
});
