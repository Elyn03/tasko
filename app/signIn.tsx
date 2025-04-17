import React, {useState} from "react"
import { StyleSheet, View, TextInput, Text } from 'react-native'

// Components
import {ThemedView} from "@/components/themed/ThemedView";
import {ThemedText} from "@/components/themed/ThemedText";
import {ThemedButton} from "@/components/themed/ThemedButton";

// Navigation
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {UserAuth} from "@/context/AuthContext";
import {Colors} from "@/constants/Colors";


export default function SignIn() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const {signInUser} = UserAuth()

    const handleSignIn = async () => {
        console.log(email, password)
        setLoading(true)
        try {
            const result = await signInUser(email, password)

            if (result.success) {
                navigation.navigate("HomePage")
            } else {
                if (result.error === "invalid") {
                    setError("Email ou mot de passe invalide")
                } else if (result.error === "missing") {
                    setError("Veuillez remplir tous les champs")
                } else {
                    setError("Une erreur est parvenue, veuillez réessayer")
                }
            }
        } catch (err) {
            setError("Une erreur est parvenue, veuillez réessayer plus tard")
        } finally {
            setLoading(false)
        }
    }

    const goToSignUp = () => {
        navigation.navigate("SignUp")
    }

    return (
        <ThemedView>
            <View style={styles.logContainer}>
                <ThemedText type={"title"} style={styles.logText}>Se connecter</ThemedText>

                <TextInput
                    style={styles.logInput}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    autoCapitalize={'none'}
                    placeholder="email@adresse.com"
                />

                <TextInput
                    style={styles.logInput}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    autoCapitalize={'none'}
                    placeholder="mot de passe"
                />
                { error && <Text style={styles.errorText}>{error}</Text> }

                <View style={styles.signText}>
                    <ThemedButton
                        type={"link"}
                        onPress={() => goToSignUp()}
                        title={"Créer un compte"}
                    />
                </View>

                <ThemedButton
                    onPress={() => handleSignIn()}
                    type={"default"}
                    title={"Se connecter"}
                />
            </View>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    logContainer: {
        padding: 24,
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
    },
    logText: {
        textAlign: "center"
    },
    logInput: {
        padding: 12,
        width: "100%",
        borderRadius: 8,
        borderWidth: 1,
        backgroundColor: "#FEFEFF",
        borderColor: "#757575"
    },
    signText: {
        width: "100%",
        alignItems: "flex-end",
    },
    errorText: {
        color: "#c32a2a",
        fontStyle: "italic"
    }
})
