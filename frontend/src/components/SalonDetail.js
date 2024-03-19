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
    const dateString = moment(day.dateString).format('YYYY-MM-DD');
    setSelectedDate(dateString);

    try {
        const response = await axios.get(`${BaseUrl}/api/reservations/${salonID}/availability`, {
            params: { date: dateString }
        });
        console.log(response.data)
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
    setShowServiceModal(false);
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
    } catch (error) {
      console.error("Error creating reservation:", error);
    }
  };
  useEffect(() => {
    console.log('Available times updated:', availableTimes);
  }, [availableTimes]);
  const openingTime = moment(salon.Open).format('HH:mm');
  const closingTime = moment(salon.Close).format('HH:mm');

  // Get the current time
  const currentTime = moment().format('HH:mm');

  // Check if the current time is within the opening hours
  const isOpenNow = currentTime >= openingTime && currentTime <= closingTime;
  return (
    <View style={styles.container}>
      <ScrollView>
      <Image
        source={{ uri: `${BaseUrl}/${salon.Photo}` }}
        style={styles.salonImage}
      />
      <View style={styles.DateBlock}>
        <View style={[ isOpenNow ? styles.StatusOpen : styles.Status]}>
          <Text style={{color:"white"}}>{isOpenNow ? 'Open' : 'Closed'}</Text>

          </View>
         

          </View>
      <View style={styles.firstBlock}>
      <Text>Salon Name:{ salon.Name}</Text>
      <Text>Salon Owner: {salon.User ?  salon.User.username:null}</Text>
      <Text >Salon Services: 

  {salon.Services ? salon.Services.map(service => (
    <Text key={service._id}> {service.Name}</Text>
  )):null}
  </Text>
      </View>
      <Calendar
        onDayPress={onDaySelect}
        markedDates={{
          [moment(selectedDate).format("YYYY-MM-DD")]: { selected: true },
        }}
      />

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
        </View>
      </Modal>
<View style={{paddingHorizontal:10,paddingVertical:10}}>
      {selectedService && (
        <TouchableOpacity onPress={createReservation} style={styles.bookButton}>
          <Text>Book Now</Text>
        </TouchableOpacity>
      )}
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  DateBlock:{
    paddingHorizontal:10,
    flexDirection:"row",

  },
  Status:{
    backgroundColor:"red",
    borderRadius:24,
    width:"20%",
    alignItems:"center"
  },
  StatusOpen:{
    backgroundColor:"#0f0",
    borderRadius:24,
    width:"20%",
    alignItems:"center"
  },
  firstBlock:{
    paddingHorizontal:10
  },
  

  container: {
    flex: 1,
  },
  salonImage: {
    width: "100%",
    height: 200,
    marginBottom: 10,
  },
  timeSlot: {
    padding: 10,
    backgroundColor: "#0BDA51",  
    marginBottom: 5, 
    marginLeft:3,
    marginRight:3
  },
  timeSlotDisabled: {
    backgroundColor: "#ff007f",
  },
  serviceItem: {
    padding: 10,
    backgroundColor: "#0f0",
    marginBottom: 5,
    marginLeft:10,
  },
  bookButton: {
    backgroundColor: "#0f0",
    borderRadius:10,
    padding: 10,
    alignItems: "center",
  },
 
  modalView: {
    marginTop:"50%",
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:"10%",
    maxHeight:"45%",
    maxWidth:"100%",
  },
  noSlotsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "red",
  },
});
