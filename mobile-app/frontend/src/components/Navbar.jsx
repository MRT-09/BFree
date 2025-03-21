import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, StatusBar, SafeAreaView, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const Navbar = () => {
  
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dat1 = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const fetchData = async () => {
    try {
        const date = new Date().toISOString().split('T')[0];
        const url = `${EXPO_PUBLIC_API_URL}incidents/daily`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        setData(json.incidents);
    } catch (err) {
        console.error('Error fetching data:', err.message);
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.profileSection}>
          <View style={styles.userInfo}>
            <Text style={styles.header}>Today's Activity</Text>
            <Text style={styles.date}>{dat1}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <FontAwesome name="sign-out" size={24} color="#4285F4" />
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#4285F4" />
        ) : error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Total Incidents today</Text>
            <Text style={styles.cardValue}>{data || 0}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 5 : 0,
    elevation: 1,
  },
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  profileSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  header: {
    fontSize: 27,
    fontWeight: "bold",
  },
  date: {
    color: "gray",
    fontWeight: "500",
    marginBottom: 10,
    fontSize: 17,
  },
  logoutButton: {
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 5,
    backgroundColor: '#f3f4f6',
    borderRadius: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    backgroundColor: '#edf3fe',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 15,
    marginTop: 15,
  },
  cardHeader: {
    textJustify: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: '#2f4dcc',
  },
  cardValue: {
    textJustify: 'center',
    fontSize: 40,
    fontWeight: '600',
    color: '#2f4dcc',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Navbar;