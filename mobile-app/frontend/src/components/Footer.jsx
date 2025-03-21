import React from "react";
import {
    Pressable,
    StyleSheet,
    View,
    Text,
    TouchableOpacity, 
    Platform, 
    StatusBar, 
    SafeAreaView,
} from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Pressable as PressableRaw } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
const Footer = () => {
    const navigation = useNavigation();
    function Pressable(props) {
        return <PressableRaw
                onPress={props.onPress}
                hitSlop={props.hitSlop}
                style={({ pressed }) => [props.style || {}, {opacity:pressed ? 0.5 : 1}]}
                >{props.children}</PressableRaw>
    }
    return ( 
        <View style = { styles.footer } >
            <Pressable style={styles.pressab} onPress = {() => navigation.navigate('Home')} >
                <Entypo name = "home" size = { 30 } color = "#3662e3" />
                <Text style = { styles.footerText } > Home </Text>
            </Pressable>
            <Pressable style={styles.pressab} onPress = {() => navigation.navigate('IncidentAnalytics')} >
                <Octicons name="graph" size={30} color="#3662e3" />
                <Text style={styles.footerText}>Analytics</Text>
            </Pressable>
        </View>
    );
};
const styles = StyleSheet.create({
    footer: {
        height: 70,
        backgroundColor: 'white',
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    footerText: {
        color: "#3662e3",
        fontSize: 14,
        textAlign: "center",
        fontFamily: 'Roboto',
    },
    pressab: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export default Footer;