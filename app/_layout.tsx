import {Colors} from "@/constants/Colors";
import {Ionicons} from "@expo/vector-icons";

// Screen
import HomeScreen from "@/app/index";
import MapScreen from "@/app/map";
import StoreScreen from "@/app/store";
import CreationScreen from "@/app/creation";
import ProfileScreen from "@/app/profile";
import SignIn from "@/app/signIn";
import SignUp from "@/app/signUp";

// Navigator
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from "@react-navigation/native-stack";

// Provider
import {AuthContextProvider} from "@/context/AuthContext";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function RootLayout(props: any) {
    return (
        <AuthContextProvider>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="SignIn" component={SignIn} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="HomePage" component={HomePage} />
            </Stack.Navigator>
        </AuthContextProvider>
    )
}

function HomePage() {
    return (
        <Tab.Navigator
            initialRouteName={"Home"}
            screenOptions={({route}) => ({
                headerShown: false,
                tabBarStyle: {
                    height: 60,
                },
                tabBarActiveTintColor: Colors.salmon,
                tabBarInactiveTintColor: Colors.pinkSalmon,
                tabBarIcon: ({focused}) => {
                    let icon: keyof typeof Ionicons.glyphMap = "home";
                    if (route.name === "Map") {
                        icon = "map"
                    } else if (route.name === "Creation") {
                        icon = "add-circle"
                    } else if (route.name === "Store") {
                        icon = "storefront"
                    } else if (route.name === "Profile") {
                        icon = "person"
                    }

                    return (
                        <Ionicons name={icon} size={24} color={focused ? Colors.salmon : Colors.pinkSalmon} />
                    )
                }
            })}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Creation" component={CreationScreen} />
            <Tab.Screen name="Store" component={StoreScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    )
}
