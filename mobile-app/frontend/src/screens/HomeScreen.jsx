import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomeScreen = () => {
  
  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.content}>

      </View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});

export default HomeScreen; 