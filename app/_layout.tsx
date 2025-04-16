import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Colors} from "@/constants/Colors";
import {Ionicons} from "@expo/vector-icons";

// Screen
import HomeScreen from "@/app/index";
import MapScreen from "@/app/map";
import StoreScreen from "@/app/store";
import CreationScreen from "@/app/creation";
import ProfileScreen from "@/app/profile";

const Tab = createBottomTabNavigator();

export default function RootLayout() {
      return (
          <Tab.Navigator
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
      );
}
