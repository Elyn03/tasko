import React, {useEffect, useState} from "react";
import {supabase} from "@/lib/supabase";
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "@/constants/Colors";

// Components
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {ThemedButton} from "@/components/themed/ThemedButton";
import {ThemedView} from "@/components/themed/ThemedView";
import {ThemedText} from "@/components/themed/ThemedText";

// Context
import {UserAuth} from "@/context/AuthContext";

// Hooks
import {findUser} from "@/hooks/findUser";
import findLocalisation from "@/hooks/findLocalisation";

export default function CreationScreen() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [position, setPosition] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const {session} = UserAuth()

    useEffect(() => {
    }, []);

    const getPosition = () => {
        // TODO: get position right now
        let position = findLocalisation()
        console.log("my position", position)
/*
        setPosition(position)
*/
    }


    const createTask = async () => {
        let user = await findUser(session);

        if (!title) {
            setErrorMessage("Veuillez renseigner le titre !")
            return
        }
        if (!position) {
            setErrorMessage("Veuillez renseigner une position !")
            return
        }

        // POINT(lng lat)
        const { error } = await supabase
            .from("tasks")
            .insert({
                user_id: user.id,
                title: title,
                description: description ? description : null,
                location: "POINT(2.320041 48.8588897)",
            })

        if (error) return {success: false, error: error}

        setTitle("")
        setDescription("")
        setPosition("")
        return {success: true}
    }

    return (
        <ThemedView showHeader={false}>
            <View style={styles.container}>
                <ThemedText type={"title"} style={styles.title}>Ajouter une nouvelle tâche</ThemedText>

                <View style={styles.inputContainer}>
                    <ThemedText type={"default"}>Titre de la tâche*</ThemedText>
                    <TextInput
                        style={styles.taskInput}
                        onChangeText={(text) => setTitle(text)}
                        value={title}
                        autoCapitalize={'none'}
                        placeholder="Titre de la tâche"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <ThemedText type={"default"}>Description de la tâche</ThemedText>
                    <TextInput
                        style={styles.taskInput}
                        onChangeText={(text) => setDescription(text)}
                        value={description}
                        autoCapitalize={'none'}
                        placeholder="Description (facultatif)"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <ThemedText type={"default"}>Position*</ThemedText>
                    <View style={styles.mapPositionContainer}>
                        <TextInput
                            style={[styles.taskInput, styles.positionInput]}
                            onChangeText={(text) => setPosition(text)}
                            value={position}
                            autoCapitalize={'none'}
                            placeholder="Position"
                        />
                        <TouchableOpacity onPress={getPosition}>
                            <Ionicons name={"locate"} size={36} color={Colors.darkTeal} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.mapContainer}>

                </View>

                { errorMessage && <Text style={styles.errorText}>{errorMessage}</Text> }

                <ThemedButton
                    type={"default"}
                    title={"Ajouter"}
                    onPress={createTask}
                />
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        gap: 24
    },
    inputContainer: {
        display: "flex",
        flexDirection: "column",
    },
    title: {
        textAlign: "center"
    },
    taskInput: {
        padding: 12,
        width: "100%",
        borderRadius: 8,
        borderWidth: 1,
        backgroundColor: "#FEFEFF",
        borderColor: "#757575"
    },
    mapContainer: {
        width: "100%",
        height: 200,
        backgroundColor: "#444",
        borderRadius: 8
    },
    mapPositionContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    positionInput: {
        width: "85%"
    },
    errorText: {
        color: "#c32a2a",
        fontStyle: "italic",
        textAlign: "center"
    }
})
