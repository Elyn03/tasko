import { Button, StyleSheet } from "react-native";
import {ThemedView} from "@/components/themed/ThemedView";
import {ThemedText} from "@/components/themed/ThemedText";
import {useEffect, useState} from "react";
import {Session} from "node:inspector";
import {supabase} from "@/lib/supabase";
import {ParamListBase, useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

export default function HomeScreen() {

    const [session, setSession] = useState<Session | null>(null);
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session: any } }) => {
            if (session){
                console.log(session)
                setSession(session)
            }
        })
        supabase.auth.onAuthStateChange((_event, session: any) => {
            setSession(session)
        })

    }, [])

    const click = () => {
        console.log(session)
    }

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            navigation.navigate("SignIn")
            // Session will be cleared automatically by the onAuthStateChange listener
        } catch (error) {
            console.error("Error signing out:", error);
        }

    }

    return (
        <ThemedView style={styles.container}>
            {/* Main content */}
            <ThemedText>HERE IS THE LIST OF YOUR TASKS</ThemedText>
            <Button onPress={() => click()} title={"CLICK"} />
            <Button onPress={() => logout()} title={"LOG OUT"} />

            {/* Login overlay that appears when not logged in */}
        </ThemedView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loginContainer: {
        padding: 0,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    }
});


