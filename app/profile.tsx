import {StyleSheet, View, Image, Switch} from "react-native";
import {useEffect, useState} from "react";
import {Colors} from "@/constants/Colors";
import {supabase} from "@/lib/supabase";
import * as Notifications from 'expo-notifications';

// Context
import {UserAuth} from "@/context/AuthContext";
import {AppTheme} from "@/context/ThemeContext";

// Navigation
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// Components
import {ThemedView} from "@/components/themed/ThemedView";
import {ThemedText} from "@/components/themed/ThemedText";
import {ThemedButton} from "@/components/themed/ThemedButton";

// Hooks
import {findUser} from "@/hooks/findUser";
import {getImageProfile} from "@/hooks/handleLocalStorage";

type IUser = {
    id: number;
    name: string;
    email: string;
} | null;


export default function ProfileScreen() {

    const [user, setUser] = useState<IUser>(null)
    const [isLightMode, setIsLightMode] = useState<boolean>(true)
    const [enableNotif, setEnableNotif] = useState<boolean>(false)
    const [duckUrl, setDuckUrl] = useState<string>("https://images.unsplash.com/photo-1578956919791-af7615c94b90?q=80&w=1939&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")

    const {session, signOut} = UserAuth()
    const {theme, toggleTheme} = AppTheme()
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    useEffect(() => {
        getUser().then()
        getProfile().then()
        setIsLightMode(theme === "light")
    }, []);

    const getUser = async () => {
        let user = await findUser(session);
        setUser(user)
    }

    const getProfile = async () => {
        let image = await getImageProfile(session);
        setDuckUrl(image)
    }

    const toggleThemeColor = () => {
        setIsLightMode(!isLightMode)
        toggleTheme()
    }

    const logOut = async () => {
        const { error} = await supabase.auth.signOut();
        navigation.navigate("SignIn")
    }

    const notificationRequest = async () => {
        const { status } = await Notifications.requestPermissionsAsync()
        console.log(status)
        if (status) {
            setEnableNotif(status === "granted" )
        }
    }

    return (
        <ThemedView>
            <View style={styles.container}>
                <View style={styles.imageProfile}>
                    <Image
                        style={styles.image}
                        source={{
                            uri: duckUrl,
                        }}
                    />
                </View>

                <View>
                    <ThemedText style={styles.infoText}>{user ? user.name : "Indéfini"}</ThemedText>
                    <ThemedText style={styles.infoText}>{user ? user.email : "Indéfini"}</ThemedText>
                </View>

                <View style={styles.settingsProfile}>
                    <View style={styles.setting}>
                        <ThemedText style={styles.settingText}>Mode Clair</ThemedText>
                        <Switch
                            trackColor={{false: Colors.teal, true: Colors.pinkSalmon}}
                            thumbColor={isLightMode ? Colors.teal : Colors.pinkSalmon}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleThemeColor}
                            value={isLightMode}
                        />
                    </View>
                    <View style={styles.setting}>
                        <ThemedText style={styles.settingText}>Notifications</ThemedText>
                        <Switch
                            trackColor={{false: Colors.teal, true: Colors.pinkSalmon}}
                            thumbColor={enableNotif ? Colors.teal : Colors.pinkSalmon}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={notificationRequest}
                            value={enableNotif}
                        /></View>
                </View>

                <ThemedButton
                    type={"secondary"}
                    title={"Se déconnecter"}
                    onPress={logOut}
                />
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
    },
    imageProfile: {
        height: 150,
        width: 150,
        borderRadius: 500,
        backgroundColor: Colors.pinkSalmon
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        overflow: "hidden",
        borderRadius: 500

    },
    infoText: {
        textAlign: "center"
    },
    settingsProfile: {
        width: "100%",
        justifyContent: "flex-start"
    },
    setting: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 16
    },
    settingText: {
        textAlign: "left"
    }
})