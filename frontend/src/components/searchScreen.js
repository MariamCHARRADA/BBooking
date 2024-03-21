import React, { useState, useEffect ,useCallback} from "react";
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
import { useNavigation,useFocusEffect } from "@react-navigation/native";

import axios from "axios";
import { BaseUrl } from "../../config/config";

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [salons, setSalons] = useState([]);
  const [cities, setCities] = useState([]);
  const navigation = useNavigation();

  const [filteredSalons, setFilteredSalons] = useState([]);
  useEffect(() => {
    fetchCities();
    fetchSalons();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/api/cities/getCities`);
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchSalons = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/api/salons/getSalons`);
      setSalons(response.data);
    } catch (error) {
      console.error("Error fetching salons:", error);
    }
  };

  useEffect(() => {
    const filtered = salons
      .map((salon) => {
        // Find the city object that matches the City ID in the salon object
        const cityObj = cities.find((city) => city._id === salon.City);
        // Replace or augment the salon object with the city name
        return {
          ...salon,
          CityName: cityObj ? cityObj.Name : "Unknown",
        };
      })
      .filter((salon) => {
        const searchMatch = salon.Name.toLowerCase().includes(
          searchTerm.toLowerCase()
        );
        const cityMatch = selectedCity === "" || salon.City === selectedCity;

        return searchMatch && cityMatch;
      });

    setFilteredSalons(filtered);
  }, [searchTerm, selectedCity, salons, cities]);
  useFocusEffect(
    useCallback(() => {
      fetchSalons();


   
    }, [])
); 
  return (

      <View style={styles.container}>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.salonSearch}
            placeholder="Search for salons..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCity}
              onValueChange={(itemValue) => setSelectedCity(itemValue)}
              style={styles.cityPicker}
            >
              <Picker.Item label="Select a city" value="" />
              {cities.map((city) => (
                <Picker.Item
                  key={city._id}
                  label={city.Name}
                  value={city._id}
                />
              ))}
            </Picker>
          </View>
        </View>

        <FlatList
          data={filteredSalons}
          keyExtractor={(item) => item._id}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("SalonDetail", {
                  salonID: item._id,
                })
              }
            >
              <View>
                {item.Photo && (
                  <Image
                    style={styles.image}
                    source={{ uri: `${BaseUrl}/` + item.Photo }}
                  />
                )}
                <Text style={styles.cardText}>
                  {item.Name} - {item.CityName}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  // Search screen container
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    paddingHorizontal: 5,
  },

  // Search Tabs container
  searchContainer: {
    marginTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 15,
  },
  salonSearch: {
    height: 37,
    width: "63%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  pickerContainer: {
    height: 37,
    width: "35%",
    justifyContent: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#ffffff", // Set the background color you want for the picker
  },
  cityPicker: {
    width: "100%",
    color: "gray", // Only the text color will apply
  },

  // salon cards
  card: {
    flex: 1,
    margin: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 5,
    backgroundColor: "#fff4f2",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 50,
    alignSelf: "center",
  },
  cardText: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
});

export default SearchScreen;
