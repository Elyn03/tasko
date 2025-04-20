import {useEffect, useState} from "react";
import {StyleSheet, ScrollView, View, Image} from "react-native";
import {Colors} from "@/constants/Colors";
import moment from "moment";
import app from "@/app.json";
import {getAddressFromCoords} from "@/lib/getAddressFromCoords";

// Navigation
import {ParamListBase, useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

// Components
import {ThemedView} from "@/components/themed/ThemedView";
import {ThemedText} from "@/components/themed/ThemedText";
import Header from "@/components/Header";
import {Address} from "@/components/Task";

export default function TaskScreen(props: any) {

    const [task, setTask] = useState(props.route.params.task)
    const [address, setAddress] = useState<Address | null>(null);

    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const apiKey = app.expo.android.config.googleMaps.apiKey;
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${task.lat},${task.lng}&zoom=15&size=600x300&markers=color:red%7C${task.lat},${task.lng}&key=${apiKey}`;
    const { house_number: houseNumber, road, city, railway } = address || {};
    const parts = [railway, houseNumber, road, city, railway].filter(Boolean);
    const addressLocation = parts.join(", ");

    useEffect(() => {
        setTask(props.route.params.task)

        const fetchAddress = async () => {
            const { address } = await getAddressFromCoords(task.lat, task.lng);
            setAddress(address);
        };
        fetchAddress().then();
    }, []);



    const goBack = () => {
        navigation.goBack()
    }

    if (!task) return

    return (
        <ThemedView showHeader={false} isScrollView={false}>
            <Header title={task.title} defaultHeader={false} />
            <View style={styles.container}>
                <View style={styles.mapContainer}>
                    <Image
                        source={{ uri: task.uri || mapUrl }}
                        style={styles.map}
                    />
                </View>
                <ScrollView style={[ styles.info, { backgroundColor: task.done ? Colors.salmon : Colors.teal } ]}>

                    <ThemedText fontColor={"#FFFFFF"} style={styles.infoMiniText}>Créer le : {moment(task.created_at).format("LLL")}</ThemedText>
                    <ThemedText fontColor={"#FFFFFF"} style={styles.infoMiniText}>Fait : {task.done ? "Oui" : "Non"}</ThemedText>
                    { addressLocation &&
                        <ThemedText fontColor={"#FFFFFF"} style={styles.infoMiniText}>Adresse : {addressLocation}</ThemedText>
                    }
                    <ThemedText fontColor={"#FFFFFF"} style={styles.infoDescriptionText}>{task.description}</ThemedText>
                </ScrollView>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    },
    mapContainer: {
        height: "35%",
        objectFit: "cover"
    },
    map: {
        width: "100%",
        height: "100%",
    },
    info: {
        width: "100%",
        padding: 24,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12
    },
    infoMiniText: {
        fontStyle: "italic"
    },
    infoDescriptionText: {
        marginTop: 24
    }
})