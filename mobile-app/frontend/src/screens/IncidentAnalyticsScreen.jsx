import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Pressable,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import Footer from "../components/Footer";

const IncidentAnalytics = () => {
  const [period, setPeriod] = useState("day");
  const navigation = useNavigation();
  return (
    <View style={styles.WholeScreen}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View>
            <Text style={styles.headerText}>Incident analytics</Text>
          </View>
        </View>
      </SafeAreaView>
      <View style={styles.container1}>
        <View style={styles.card}>
          <View style={styles.cardHalf}>
            <Text style={styles.totalIncindets}>Incidents this {period}</Text>
            <Text style={styles.totalIncindets}>last {period}</Text>
          </View>
          <View style={styles.cardHalf}>
            <Text>0</Text>
            <Text>0</Text>
          </View>
        </View>

      </View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  WholeScreen: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  safeArea: {
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 0,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  container1: {
    flex: 1,
    padding: 20,
    width: "100%",
    height: "100%",
    backgroundColor: "#f9fafb",
  },
  headerText: {
    fontSize: 30,
    fontWeight: "semibold",
  },
  card: {
    justifyContent: "space-around",
    alignItems: "center",
    width: "90%",
    height: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  cardHalf: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalIncindets: {
    fontSize: 30,
    color: "gray",
  },
  incidnetTrend: {},
});
export default IncidentAnalytics;
