import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function RootLayout(props: any) {
  return (
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
  );
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
