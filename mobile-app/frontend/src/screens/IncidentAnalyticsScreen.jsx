import React, { Suspense, useState, useEffect } from "react";
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
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import Footer from "../components/Footer";
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

import LineChartComponent from "../components/LineChart";
import "../services/sound";

const Progress = (props) => {
  if(props.cw===0 || props.pw==0){
    return(<Text>NaN</Text>);
  }
  
  const progress = Math.floor(props.pw / props.cw * 100);



  if(progress < 100){
    return(
      <View style={styles.progress}>
        <AntDesign name="arrowdown" size={15} color="green" />
        <Text style={styles.progressGT}>{100 - progress}%</Text>
      </View>
    );
  }
  else{
    return(
      <View style={styles.progress}>
        <AntDesign name="arrowup" size={15} color="red" />
        <Text style={styles.progressRT}>{progress - 100}%</Text>
      </View>
    );
  }


};
const Fallback = () =>{
  return(
    <View style={styles.fb}>
      <Text>Loading...</Text>
    </View>
  );
};
const IncidentAnalytics = () => {
  
  const navigation = useNavigation();

    const [data, setData] = useState(null);
    const [pdata, setPData] =useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wsum,setSum]=useState(0);
    const [pwsum,setPSum]=useState(0);
    const dat1 = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const fetchData = async () => {
      try {
          const date = new Date().toISOString().split('T')[0];
          const url = `${EXPO_PUBLIC_API_URL}incidents/weekly`;
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
          
          let sum = 0;
          setData(json.incidents);
          for (let i = 0; i < 7; i++) {
            let currentIncidents = json.incidents[i].incidents;
            sum += currentIncidents;
          }
          setSum(sum);
      } catch (err) {
          console.error('Error fetching data:', err.message);
          setError(err.message);
      } finally {
          setLoading(false);
      }
    };
    
    
    const fetchPData = async () => {
      try {
          const date = new Date().toISOString().split('T')[0];
          const url = `${EXPO_PUBLIC_API_URL}incidents/weeklyp`;
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
          
          let sum = 0;
          setPData(json.incidents);
          for (let i = 0; i < 7; i++) {
            let currentIncidents = json.incidents[i].incidents;
            sum += currentIncidents;
          }
          setPSum(sum);
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
    
  console.log(data);
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
            <Text style={styles.totalIncidents}>Total incidents this week</Text>
            <Progress cw={wsum} pw={pwsum}/>
            
          </View>
          <View style={styles.cardHalf}>
            <Text style={styles.incidentsText}>{wsum}</Text>
            
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHalf}>
            <Text style={styles.totalIncidents}>Incidents last week</Text>
            
          </View>
          <View style={styles.cardHalf}>
            <Text style={styles.incidentsText}>{pwsum}</Text>
            
          </View>
        </View>
        <View style={styles.incidentTrend}>
          <Text style={styles.iText}>Incident trend</Text>
          <Suspense fallback={Fallback} style={styles.chartVis}>
            
          {loading ? <Fallback /> : <LineChartComponent data={data}/>}
         </Suspense>
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
    alignItems: 'center',
  },
  container1: {
    flex: 1,
    padding: 20,
    width: "100%",
    height: "100%",
    backgroundColor: "#f9fafb",
    justifyContent: "space-around",
    alignItems: 'center',
  },
  headerText: {
    fontSize: 30,
    fontWeight: "semibold",
  },
  card: {
    justifyContent: "space-around",
    alignItems: "center",
    width: "95%",
    height: 90,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHalf: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    alignContent: "flex-end",
    height: '50%',
    width: '100%',
  
  },
  totalIncidents: {
    fontSize: 17,
    color: "gray",
  },
  progress: {
    flexDirection: 'row'
  },
  progressRT: {
    color: 'red',
    fontSize: 15,
  },
  progressGT: {
    color: 'green',
    fontSize: 15,
  },
  incidentsText: {
    fontSize: 25,
  },
  incidentTrend: {
    width: "95%",
    height: 390,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartVis: {
    width: '95%',
    height: '80%',
  },
  fb: {
    width: '95%',
    height: '80%',
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',

  },
  bar: {
    width: 20,
    backgroundColor: '#6fa1f0',
    borderStartStartRadius: 7,
    borderEndStartRadius: 7,
  },
  histogram: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: '100%',
    height: '90%',
  },
  iH: {
    flexDirection: 'row',
    width: '100%',
    height: '50%',
    alignItems: 'flex-end',
    justifyContent: 'space-around'
  },
  ob: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bt: {
    color: '#4f81d0',
  },
});
export default IncidentAnalytics;
