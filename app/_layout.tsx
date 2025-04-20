import {useEffect, useRef, useState} from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {Platform, Pressable} from "react-native";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from "expo-constants";

// Screen
import HomeScreen from "@/app/index";
import MapScreen from "@/app/map";
import StoreScreen from "@/app/store";
import CreationScreen from "@/app/creation";
import ProfileScreen from "@/app/profile";
import SignIn from "@/app/signIn";
import SignUp from "@/app/signUp";
import TaskScreen from "@/app/listTasks/[task]";

// Navigator
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Provider
import { AuthContextProvider } from "@/context/AuthContext";
import { AppTheme, ThemeContextProvider } from "@/context/ThemeContext";
import { TasksContextProvider } from "@/context/TaskManager";
import { NetworkContextProvider } from "@/context/NetworkContext";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowAlert: true
    })
})

export default function RootLayout(props: any) {
    const [expoPushToken, setExpoPushToken] = useState("")
    const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined
    );
    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

        if (Platform.OS === 'android') {
            Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
        }
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            notificationListener.current &&
            Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
            Notifications.removeNotificationSubscription(responseListener.current);
        };

    }, []);


    return (
        <NetworkContextProvider>
            <AuthContextProvider>
                <ThemeContextProvider>
                    <TasksContextProvider>
                        <Stack.Navigator screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="SignIn" component={SignIn} />
                            <Stack.Screen name="SignUp" component={SignUp} />
                            <Stack.Screen name="HomePage" component={HomePage} />
                            <Stack.Screen
                                name="Task"
                                component={TaskScreen}
                                options={({ route }) => {
                                    const params = route.params as { id?: string, task?: any };
                                    return { title: params.id ?? "0" };
                                }}
                            />
                        </Stack.Navigator>
                    </TasksContextProvider>
                </ThemeContextProvider>
            </AuthContextProvider>
        </NetworkContextProvider>    );
}

function HomePage() {
  const { theme } = AppTheme();
  const isLightMode = theme === "light";

  const backgroundColor = isLightMode ? "#FEFEFE" : "#252525";
  const activeTintColor = Colors.salmon;
  const inactiveTintColor = isLightMode ? Colors.darkTeal : Colors.lightTeal;

  return (
    <Tab.Navigator
      initialRouteName={"Home"}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 60,
          backgroundColor: backgroundColor,
        },
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarIcon: ({ focused }) => {
          let icon: keyof typeof Ionicons.glyphMap = "home";
          if (route.name === "Map") {
            icon = "map";
          } else if (route.name === "Creation") {
            icon = "add-circle";
          } else if (route.name === "Store") {
            icon = "storefront";
          } else if (route.name === "Profile") {
            icon = "person";
          }

          return (
            <Ionicons
              name={icon}
              size={24}
              color={focused ? activeTintColor : inactiveTintColor}
            />
          );
        },
        tabBarButton: (props) => {
          return (
            <Pressable
              {...props}
              android_ripple={{ color: activeTintColor, borderless: false }}
              style={(state) => [
                props.style,
                {
                  opacity: state.pressed ? 0.8 : 1,
                  transform: [{ scale: state.pressed ? 0.95 : 1 }],
                },
              ]}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Creation" component={CreationScreen} />
      <Tab.Screen name="Store" component={StoreScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('myNotificationChannel', {
            name: 'A channel is needed for the permissions prompt to appear',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        console.log("Device", existingStatus)
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return;
        }

        try {
            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
            if (!projectId) {
                throw new Error('Project ID not found');
            }
            token = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log(token);
        } catch (e) {
            token = `${e}`;
        }
    }

    return token;
}