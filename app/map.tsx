import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Animated,
  Easing,
} from "react-native";
import LottieView from "lottie-react-native";
import { supabase } from "@/lib/supabase";
import findLocalisation from "@/hooks/findLocalisation";

// Components
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";

// Colors
import { AppTheme } from "@/context/ThemeContext";
import { MapColors } from "@/constants/MapColors";

// Map
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {Task, UserTasks} from "@/context/TaskManager";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import {ParamListBase, useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  /*  const [pins, setPins] = useState<{ id: String; lat: number; lng: number }[]>(
    []
  ); */

  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedCoord, setSelectedCoord] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const animation = useRef<LottieView>(null);

  const localisation = findLocalisation();
  const latitude = localisation?.coords.latitude || 0;
  const longitude = localisation?.coords.longitude || 0;

  const popupAnim = useRef(new Animated.Value(0)).current;
  const { theme } = AppTheme();
  const { tasks } = UserTasks();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const showPopup = () => {
    setPopupVisible(true);
    Animated.timing(popupAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const hidePopup = () => {
    Animated.timing(popupAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setPopupVisible(false));
  };

  const popupTranslateY = popupAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 0],
  });

  const navigateToTask = () => {
    if (selectedTask) {
      navigation.navigate("Task", {
        id: selectedTask.task_id + "",
        task: selectedTask,
      })
    }
  }

  return (
    <ThemedView showHeader={false} isScrollView={false}>
      {localisation ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          customMapStyle={theme === "light" ? MapColors.light : MapColors.dark}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          <Marker
            coordinate={{
              latitude,
              longitude,
            }}
            onPress={() => {
              mapRef.current?.animateToRegion(
                {
                  latitude,
                  longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                },
                1000
              );
            }}
          />
          {tasks
            .filter((pin) => pin.lat && pin.lng)
            .map((pin, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: pin.lat,
                  longitude: pin.lng,
                }}
                onPress={() => {
                  setSelectedCoord({
                    latitude: pin.lat,
                    longitude: pin.lng,
                  });
                  setSelectedTask(pin);
                  setPopupVisible(true);
                  showPopup();
                }}
              ></Marker>
            ))}
        </MapView>
      ) : (
        <View style={styles.animationContainer}>
          <ThemedText type="title" style={{ paddingTop: 16, paddingLeft: 16 }}>
            Chargement de la carte ...
          </ThemedText>
          <LottieView
            autoPlay
            ref={animation}
            style={{
              width: 200,
              height: 200,
              backgroundColor: "transparent",
            }}
            source={require("../assets/animations/walkingPigeon.json")}
          />
        </View>
      )}
      {popupVisible && (
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={hidePopup}>
          <Animated.View
            style={[
              styles.popupContainer,
              {
                transform: [{ translateY: popupTranslateY }],
                opacity: popupAnim,
              },
            ]}
          >
            <View style={styles.arrowDown} />
            <TouchableOpacity
              style={styles.popup}
              onPress={(e) => navigateToTask()}
            >
              <ThemedText fontColor={Colors.dark.background} type={"semiBold"} style={styles.popupTitle}>{selectedTask ? selectedTask.title : "Indéfini"}</ThemedText>
              <ThemedText fontColor={Colors.dark.background}>Latitude: {selectedCoord.latitude.toFixed(4)}</ThemedText>
              <ThemedText fontColor={Colors.dark.background}>Longitude: {selectedCoord.longitude.toFixed(4)}</ThemedText>
              <TouchableOpacity onPress={hidePopup}></TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      )}

      {localisation && (
        <TouchableOpacity
          style={[
            styles.floatingButton,
            {
              backgroundColor:
                theme === "light" ? Colors.pinkSalmon : Colors.darkTeal,
            },
          ]}
          onPress={() => {
            if (localisation) {
              mapRef.current?.animateToRegion({
                latitude: localisation.coords.latitude,
                longitude: localisation.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              });
            }
          }}
        >
          <ThemedText>
            <Ionicons
              name={"locate"}
              size={24}
              color={theme === "light" ? Colors.darkTeal : Colors.pinkSalmon}
            />
          </ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  floatingButton: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  animationContainer: {
    display: "flex",
    alignItems: "center",
  },
  popupContainer: {
    position: "absolute",
    bottom: 40,
    left: 16,
    right: 16,
    alignItems: "center",
  },
  popup: {
    backgroundColor: Colors.pinkSalmon,
    padding: 16,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    width: "100%",
  },
  popupTitle: {
    marginBottom: 8,
  },
  arrowDown: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "white",
    marginBottom: -1,
  },
});
