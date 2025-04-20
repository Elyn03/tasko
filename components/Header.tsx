import React from 'react'
import {StyleSheet, View, Image, TouchableOpacity} from 'react-native'
import {Colors} from "@/constants/Colors";
import {ThemedText} from "@/components/themed/ThemedText";
import {ParamListBase, useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {Ionicons} from "@expo/vector-icons";

export default function Header(props: any) {

    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const goBack = () => {
        navigation.goBack()
    }

    return (
        <View style={[styles.headerContainer, { gap: props.defaultHeader ? 24 : 12 }]}>
            { props.defaultHeader ?
                <Image
                    style={styles.headerLogo}
                    source={require('../assets/images/tasko-logo.png')}
                />
                 :
                <TouchableOpacity onPress={goBack}>
                    <Ionicons
                        name={"arrow-back"}
                        size={36}
                        color={Colors.pinkSalmon}
                    />
                </TouchableOpacity>
            }

            <ThemedText
                style={styles.headerTitle}
                type={"title"}
                numberOfLines={props.title ? 3 : 1}
            >
                {props.title || "TASKO"}
            </ThemedText>
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
        alignItems: "center"
    },
    headerLogo: {
        padding: 0,
        margin: 0,
        height: 55,
        width: 55
    },
    headerTitle: {
        flexWrap: "wrap",
        width: "100%",
        color: Colors.pinkSalmon
    }
})
