import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomeScreen = () => {
  const { user } = useAuth();

  const displayName = user?.user_metadata?.username || 
                      (user?.email ? user.email.split('@')[0] : 'Anonymous');
  
  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.content}>
        {user && (
          <Text style={styles.welcomeText}>Welcome, {displayName}</Text>
        )}
      </View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 22,
    color: '#333',
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default HomeScreen; 