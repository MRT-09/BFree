import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

const HomeScreen = () => {
  const data = [4, 6, 10, 8, 6, 4, 5];
  const labels = ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM", "12AM"];
  const maxValue = Math.max(...data);

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.content}>
        <View style={styles.chartcont}>
          <Text style={styles.title}>3-Hourly Distribution</Text>
            <View style={styles.chartContainer}>
              {data.map((value, index) => (
                <View key={index} style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${(value / maxValue) * 80}%`,
                      },
                    ]}
                  />
                  <Text style={styles.label}>{labels[index]}</Text>
                </View>
              ))}
            </View>
        </View>
        <View style={styles.subcontainer2}>
          <View style={styles.subcontainer}>
            <AntDesign name="clockcircle" size={24} color="#825dea" />
            <Text style={styles.peaktext}>Peak Time</Text>
            <Text style={styles.peaktext1}>
              {labels[data.indexOf(maxValue)] || 'N/A'}
            </Text>
          </View>
          <View style={styles.subcontainer}>
            <Feather name="bar-chart" size={24} color="#50ae77" />
            <Text style={styles.peaktext}>Average</Text>
            <Text style={styles.peaktext1}>
              {data.length > 0
                ? `${(data.reduce((a, b) => a + b, 0) / data.length).toFixed(
                    1
                  )}/hour`
                : 'N/A'}
            </Text>
          </View>
        </View>
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
    paddingVertical: 35,
    paddingHorizontal: 20,
  },
  chartcont: {
    width: '100%',
    height: 330,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 10,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '80%',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  bar: {
    width: 25,
    backgroundColor: '#c1d7f9',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  label: {
    marginTop: 5,
    fontSize: 12,
    color: '#6e6f85',
    fontWeight: '500',
  },
  subcontainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: '47%',
    height: '100%',
    borderRadius: 10,
    elevation: 0.5,
  },
  subcontainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 35,
    height: 120,
    width: '100%',
  },
  peaktext: {
    fontSize: 16,
    color: '#6e6f85',
    fontWeight: '500',
    textJustify: 'center',
  },
  peaktext1: {
    fontSize: 20,
    color: 'black',
    fontWeight: '600',
    textJustify: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default HomeScreen;