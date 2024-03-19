import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

const logo = require("../../assets/BB.png");

export default function ProfileScreen() {
    const [userData, setUserData] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
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
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("userData");
            navigation.navigate("Login");
        } catch (e) {
            console.log("error logging out", e);
        }
    };

    return (
        <View style={styles.container}>
                        <View style={styles.header}>
              <Image source={logo} style={styles.logoImage} />
                <Text style={styles.headerText}>Welcome, {userData?.username || 'User' }</Text>
              </View>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <TouchableOpacity style={styles.Card} onPress={() => navigation.navigate("ProfData")}>
                    <Text style={styles.TextView}>My Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.Card} onPress={() => navigation.navigate("Reserv", { userId: userData?._id })}>
                    <Text style={styles.TextView}>My Reservations</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logout} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fafafa",
        alignItems: "center",
        justifyContent: "center",
    },
    scrollView: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 100,
    },
    header: {
      backgroundColor: "#0d0d0d",
      height: "25%",
      width: "100%",
      alignItems: "center"
    },
    logoImage: {
        width: 100,
        height: 100,
        borderRadius: 100,
        marginTop: 40,
        marginBottom: 20,
        borderColor: "black",
        borderWidth: 0.1,
    },
    headerText: {
        fontSize: 22,
        fontFamily: "serif",
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center"
    },
    Card: {
        width: 300,
        height: 65,
        justifyContent: "center",
        paddingHorizontal: 20,
        marginVertical: 18,
        borderWidth: 1.3,
        borderColor: "#0d0d0d",
        borderRadius: 50,
        backgroundColor: "#fff",
        shadowColor: "#0d0d0d",
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 20,
        elevation: 5,
    },
    logout:  {
        height: 65,
        width: 130,
        justifyContent: "center",
        paddingHorizontal: 20,
        marginVertical: 140,
        borderWidth: 2,
        borderColor: "#0d0d0d",
        borderRadius: 50,
        backgroundColor: "#ff0070",
        shadowColor: "#0d0d0d",
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 20,
        elevation: 5,  
    },
    logoutText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#fff",
        textAlign: "center"
    },
    TextView: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#0d0d0d",
        paddingLeft: 10,
    },
});
