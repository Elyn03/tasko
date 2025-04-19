import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import {Colors} from "@/constants/Colors";
import {ThemedButton} from "@/components/themed/ThemedButton";
import {ThemedText} from "@/components/themed/ThemedText";

export default function StoreCard(props: any) {

    const image = props.image ? props.image : "https://i.pinimg.com/736x/f7/17/7a/f7177a1777d04ef5727890ab4d3e9851.jpg"
    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={{
                    uri: image
                }}
            />

            <View style={styles.textsContainer}>
                <ThemedText
                    style={styles.title}
                    type={"subtitle"}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {props.title}
                </ThemedText>

                <ThemedText
                    style={styles.description}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {props.description}
                </ThemedText>

                <ThemedButton type={"secondary"} title={props.price} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "48%",
        backgroundColor: Colors.darkTeal,
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    image: {
        padding: 0,
        margin: 0,
        height: 100,
        width: "100%",
        overflow: "hidden",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    textsContainer: {
        width: "100%",
        padding: 16,
        gap: 8
    },
    title: {
        color: Colors.pinkSalmon,
        textAlign: "left"
    },
    description: {
        color: Colors.pinkSalmon
    },
})
