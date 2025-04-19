import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import {Colors} from "@/constants/Colors";
import {ThemedText} from "@/components/themed/ThemedText";

export default function Header() {
    return (
        <View style={styles.headerContainer}>
            <Image
                style={styles.headerLogo}
                source={require('../assets/images/tasko-logo.png')}
            />
            <ThemedText style={styles.headerTitle} type={"title"}>TASKO</ThemedText>
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
        color: Colors.pinkSalmon
    }
})
