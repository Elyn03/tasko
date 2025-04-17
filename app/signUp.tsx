import React, { useState } from 'react'
import {StyleSheet, View, Text, TextInput} from 'react-native'

// Components
import {ThemedView} from "@/components/themed/ThemedView";
import {ThemedText} from "@/components/themed/ThemedText";
import {ThemedButton} from "@/components/themed/ThemedButton";

// Navigation
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {UserAuth} from "@/context/AuthContext";


export default function SignUp() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const {signUpNewUser} = UserAuth()

    const handleSignUp = async () => {
        setLoading(true)
        if (!name) {
            setError("Veuillez renseigner tous les champs")
            return
        }

        try {
            const result = await signUpNewUser(name, email, password)

            if (result.success) {
                navigation.navigate("HomePage")
            } else {
                if (result.error === "disabled" || result.error === "password") {
                    setError("Veuillez renseigner tous les champs")
                } else if (result.error === "password invalid") {
                    setError("Votre mot de passe doit contenir au moins 6 caractères")
                } else if (result.error === "email invalid") {
                    setError("Le format de votre mail n'est pas valid")
                } else {
                    setError("Une erreur est parvenue, veuillez réessayer")
                }
            }
        } catch (err) {
            setError("An error occured")
            console.error("handle sign up error", err)
        } finally {
            setLoading(false)
        }
    }

    const goToSignIn = () => {
        navigation.navigate("SignIn")
    }

    return (
        <ThemedView>
            <View style={styles.signContainer}>
                <ThemedText type={"title"} style={styles.signText}>Créer un compte</ThemedText>

                <TextInput
                    style={styles.signInput}
                    onChangeText={(text) => setName(text)}
                    value={name}
                    autoCapitalize={'none'}
                    placeholder="Alphonso"
                />

                <TextInput
                    style={styles.signInput}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    autoCapitalize={'none'}
                    placeholder="email@adresse.com"
                />

                <TextInput
                    style={styles.signInput}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    autoCapitalize={'none'}
                    placeholder="mot de passe"
                />
                { error && <Text style={styles.errorText}>{error}</Text> }

                <View style={styles.logText}>
                    <ThemedButton
                        type={"link"}
                        onPress={() => goToSignIn()}
                        title={"Se connecter"}
                    />
                </View>

                <ThemedButton
                    onPress={() => handleSignUp()}
                    type={"default"}
                    title={"Créer un compte"}
                />
            </View>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    signContainer: {
        padding: 24,
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
    },
    signText: {
        textAlign: "center"
    },
    signInput: {
        padding: 12,
        width: "100%",
        borderRadius: 8,
        borderWidth: 1,
        backgroundColor: "#FEFEFF",
        borderColor: "#757575"
    },
    logText: {
        width: "100%",
        alignItems: "flex-end",
    },
    errorText: {
        color: "#c32a2a",
        fontStyle: "italic"
    }
})
