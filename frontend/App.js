import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import LoginForm from "./src/components/loginForm";
import RegisterForm from "./src/components/registerForm";
import HomeScreen from "./src/components/homeScreen";
import ProfileScreen from "./src/components/profileScreen";
import CalendarScreen from "./src/components/calendarScreen";
import SearchScreen from "./src/components/searchScreen";
import SalonDetail from "./src/components/SalonDetail";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import ProfileDetails from "./src/components/profileDetails";
import MyReservations from "./src/components/myReservations";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabNavigator() {
  return (
<Tab.Navigator
  screenOptions={{
    headerShown: false,
    tabBarStyle: {
      height: 70,
      backgroundColor: "black",
      paddingBottom: 5,
    },
    tabBarLabel: () => null, // This effectively hides the label
    tabBarHideOnKeyboard: true, // Ensures tab bar does not hide on keyboard appearance
  }}
>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={focused ? "#ff007f" : "gray"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name="search-outline"
              size={size}
              color={focused ? "#ff007f" : "gray"}
            />
          ),
        }}
      />
      
      <Tab.Screen
        name="Account"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name="person-outline"
              size={size}
              color={focused ? "#ff007f" : "gray"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen // The one that comes first
          name="Login"
          component={LoginForm}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterForm}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Acceuil"
          component={HomeTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SalonDetail"
          component={SalonDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfData"
          component={ProfileDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Reserv"
          component={MyReservations}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    alignItems: "center",
    justifyContent: "center",
  },
});
