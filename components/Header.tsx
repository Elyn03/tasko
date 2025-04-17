import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import {Colors} from "@/constants/Colors";

export default function Header() {
    return (
        <View style={styles.headerContainer}>
            <Image
                style={styles.headerLogo}
                source={require('../assets/images/tasko-logo.png')}
            />
            <Text style={styles.headerTitle}>TASKO</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        padding: 24,
        width: "100%",
        height: 100,
        backgroundColor: Colors.darkTeal,
        borderBottomRightRadius: 12,
        borderBottomLeftRadius: 12,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 24
    },
    headerLogo: {
        padding: 0,
        margin: 0,
        height: 55,
        width: 55
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.pinkSalmon
    },
})
