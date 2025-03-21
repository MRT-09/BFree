import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const LineChartComponent = (props) => {
  


    let Wdata=[];
    for(let i=1;i<7;i++){
        Wdata.push(props.data[i].incidents);

    }
    Wdata.push(props.data[0].incidents);
  const chartData = {
    
    
    
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], 
    datasets: [
      {
        data: Wdata,
        strokeWidth: 2, 
        color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`, 
      },
    ],
  };

  return (
    <View>
      
      <LineChart
        data={chartData}
        width={Dimensions.get("window").width - 70} 
        height={230}
        yAxisLabel=""
        yAxisSuffix="%"
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#f3f3f3",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0, 
          color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 10 },
          propsForDots: {
            r: "1",
            strokeWidth: "0",
            stroke: "#4A90E2",
          },
        }}
        bezier 
        style={{
          marginVertical: 10,
          borderRadius: 10,
          alignSelf: "center",
        }}
      />
    </View>
  );
};

export default LineChartComponent;
