import React from "react";
import {
    StyleSheet,
    View,
    Text,
} from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from "@react-navigation/native";
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
                <Entypo name = "home" size = {28} color = "#3662e3" />
                <Text style = { styles.footerText } > Home </Text>
            </Pressable>
            <Pressable style={styles.pressab} onPress = {() => navigation.navigate('IncidentAnalytics')} >
                <Octicons name="graph" size={28} color="#3662e3" />
                <Text style={styles.footerText}>Analytics</Text>
            </Pressable>
        </View>
    );
};
const styles = StyleSheet.create({
    footer: {
        height: 80,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
    },
    footerText: {
        color: "#3662e3",
        fontSize: 14,
        textAlign: "center",
        fontWeight: "500",
    },
    pressab: {
        marginTop: 5,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '85%',
    },
});
export default Footer;