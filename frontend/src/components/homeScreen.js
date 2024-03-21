import React, { useState, useEffect ,useCallback} from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import { BaseUrl } from "../../config/config";
import { useNavigation ,useFocusEffect} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const logo = require("../../assets/logo3.png");
const logoAll = require("../../assets/allServices.jpg");

export default function HomeScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [services, setServices] = useState([]);
  const [salons, setSalons] = useState([]);
  const [allSalons, setAllSalons] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/api/services/getServices`);
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    const fetchSalons = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/api/salons/getSalons`);
        setSalons(response.data);
        setAllSalons(response.data);
      } catch (error) {
        console.error("Error fetching salons:", error);
      }
    };

    fetchSalons();
    fetchServices();
  }, []);
  const filterData = async (serviceId) => {
    console.log("Original Salons:", allSalons);

    const SalonFilter = allSalons.filter((salon) => {
      const serviceIds = salon.Services.map((service) => service._id);
      return serviceIds.includes(serviceId);
    });

    if (SalonFilter.length === 0) {
      console.log("No salons found for this serviceId:", serviceId);
    } else {
      setSalons(SalonFilter);
    }
  };
  const filterDataAll = async () => {
    setSalons(allSalons);
  };
  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => filterData(item._id)}
      style={styles.serviceContainer}
    >
      <Image
        source={{ uri: `${BaseUrl}/` + item.Photo }}
        style={styles.serviceImage}
      />
      <Text style={styles.serviceName}>{item.Name}</Text>
    </TouchableOpacity>
  );
  const renderSalonItem = ({ item }) => (
    <TouchableOpacity
      style={styles.salonContainer}
      onPress={() =>
        navigation.navigate("SalonDetail", {
          salonID: item._id,
        })
      }
    >
      <Image
        source={{ uri: `${BaseUrl}/` + item.Photo }}
        style={styles.salonImage}
      />
      <Text style={styles.salonName}>{item.Name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logoImage} />
        </View>
        <Text style={styles.slogan}>
          Booking Glam Made As Easy As A Hair Flip !
        </Text>

        <View style={styles.servicesList}>
          <TouchableOpacity
            onPress={() => filterDataAll()}
            style={styles.serviceContainer}
          >
            <Image source={logoAll} style={styles.serviceImage} />
            <Text style={styles.serviceName}>All</Text>
          </TouchableOpacity>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={services}
            renderItem={renderServiceItem}
            keyExtractor={(item) => item._id.toString()}
          />
        </View>
        <View>
          <Text style={styles.pickSalonText}> Pick your favorite salon :</Text>
          <FlatList
            nestedScrollEnabled={true}
            scrollEnabled={false}
            style={styles.salonList}
            data={salons}
            renderItem={renderSalonItem}
            numColumns={2}
            keyExtractor={(item) => item._id.toString()}
            ItemSeparatorComponent={() => {
              return <View style={styles.separator} />;
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Home screen container
  container: {
    backgroundColor: "#fafafa",
    width: "100%",
    flex: 1,
  },
  // logo
  logoContainer: {
    alignItems: "center",
    height: 120,
  },
  logoImage: {
    resizeMode: "contain",
  },
  slogan: {
    fontSize: 15,
    textAlign: "center",
    fontFamily: "serif",
    fontWeight: "bold",
    borderTopColor: "black",
    color: "#3d3d3d",
    marginHorizontal: 90,
    borderTopWidth: 0.4,
    paddingTop: 5,
  },

  //services scroll
  servicesList: {
    marginTop: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: "#fff4f2",
    elevation: 1.5,
    shadowOffset: {width: -6, height: -6},
    flexDirection: "row",
  },
  serviceContainer: {
    marginRight: 10,
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "#ff0070",
  },
  serviceName: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 11,
  },

  // Salon List
  pickSalonText: {
    alignSelf: "flex-start",
    fontFamily: "serif",
    marginTop: 15,
    marginBottom: 20,
    paddingHorizontal: 8,
    fontSize: 14,
    color: "#000",
  },

  salonList: {
    width: "100%",
    marginBottom: 10,
  },
  salonContainer: {
    width: "46%",
    marginHorizontal: "2%",
    height: 140,
    borderRadius: 20,
    backgroundColor: "#fff4f2",
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  salonName: {
    textAlign: "center",
    padding: 5,
  },
  salonImage: {
    width: "100%",
    height: "80%",
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: "#f2f2f2",
  },
  separator: {
    marginTop: 10,
  },
});
