import React, { useState, useEffect ,useCallback} from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation,useFocusEffect } from "@react-navigation/native";

const logo = require("../../assets/BB.png");

export default function ProfileScreen() {
    const [userData, setUserData] = useState(null);
    const navigation = useNavigation();
    const fetchUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem("userData");
            const UserData1 = JSON.parse(userData);
            setUserData(UserData1);
        } catch (e) {
            console.log("error fetching user data", e);
        }
    };
    useEffect(() => {

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
    useFocusEffect(
        useCallback(() => {
            fetchUserData();


       
        }, [])
    );    return (
        <View style={styles.container}>
                        <ScrollView contentContainerStyle={styles.scrollView}>

                        <View style={styles.header}>
              <Image source={logo} style={styles.logoImage} />
                <Text style={styles.headerText}>Welcome, {userData?.username || 'User' }</Text>
              </View>
                <TouchableOpacity style={styles.Card} onPress={() => navigation.navigate("ProfData", { userId: userData})}>
                    <Text style={styles.TextView}>My Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.Card} onPress={() => navigation.navigate("Reserv", { userId: userData})}>
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
    },
    header: {
      alignItems: "center"
    },
    logoImage: {
        width: 100,
        height: 100,
        borderRadius: 100,
        marginTop: 100,
        marginBottom: 20,
        borderColor: "#0d0d0d",
        borderWidth: 0.3,
    },
    headerText: {
        fontSize: 22,
        fontFamily: "serif",
        color: "#000",
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
        borderBottomWidth: 0.3,
        borderColor: "#0d0d0d",
        width: "75%",
        paddingBottom: 30,
    },
    Card: {
        width: 300,
        height: 65,
        justifyContent: "center",
        paddingHorizontal: 20,
        marginVertical: 18,
        borderWidth: 0.3,
        borderColor: "#0d0d0d",
        borderRadius: 50,
        backgroundColor: "#fff",
        shadowColor: "#0d0d0d",
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 20,
        elevation: 1,
    },
    logout:  {
        height: 60,
        width: 130,
        justifyContent: "center",
        paddingHorizontal: 20,
        marginVertical: 140,
        borderRadius: 50,
        borderWidth: 0.5,
        borderColor: "#0d0d0d",
        backgroundColor: "#ff0070",
        shadowColor: "#0d0d0d",
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 20,
        elevation: 2,  
    },    
    logout2: {
        height: 60,
        width: 200,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
        borderWidth: 1,
        borderColor: "#ff88a2",
        borderRadius: 30,
        backgroundColor: "#ff88a2", // Soft pink for the logout button
        shadowColor: "#ff88a2",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    logoutText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#FFF",
        textAlign: "center"
    },
    TextView: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#0d0d0d",
        paddingLeft: 10,
    },
});
