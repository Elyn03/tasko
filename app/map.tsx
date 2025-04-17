import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Animated,
  Easing,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import findLocalisation from "@/hooks/findLocalisation";
import React, { useEffect, useRef, useState } from "react";

import LottieView from "lottie-react-native";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";
import { supabase } from "@/lib/supabase";

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [pins, setPins] = useState<{ id: String; lat: number; lng: number }[]>(
    []
  );

  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedCoord, setSelectedCoord] = useState({
    latitude: 0,
    longitude: 0,
  });

  const animation = useRef<LottieView>(null);

  const localisation = findLocalisation();
  const latitude = localisation?.coords.latitude || 0;
  const longitude = localisation?.coords.longitude || 0;

  const popupAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchPins = async (id: number) => {
      const { data, error } = await supabase.rpc("get_coords_by_user", {
        user_id: id,
      });

      if (error) {
        console.error("RPC error:", error);
        return null;
      }
      setPins(data);
      console.log("data user : ", data);
    };

    fetchPins(1);
  }, []);
  console.log("Pins:", pins);

  pins.map((pin) => {
    console.log(pin.lat, pin.lng);
  });

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

  return (
    <ThemedView showHeader={false}>
      {localisation ? (
        <MapView
          ref={mapRef}
          style={styles.map}
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
          {pins
            .filter((pin) => pin.lat && pin.lng)
            .map((pin, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: pin.lat,
                  longitude: pin.lng,
                }}
                onPress={() => {
                  console.log(pin.lat, pin.lng);
                  setSelectedCoord({
                    latitude: pin.lat,
                    longitude: pin.lng,
                  });
                  setPopupVisible(true);
                  showPopup();
                }}
              ></Marker>
            ))}
        </MapView>
      ) : (
        <View>
          <ThemedText>Loading map...</ThemedText>
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
              onPress={(e) => e.stopPropagation()}
            >
              <Text style={styles.popupTitle}>Tour Eiffel</Text>
              <Text>Latitude: {selectedCoord.latitude.toFixed(4)}</Text>
              <Text>Longitude: {selectedCoord.longitude.toFixed(4)}</Text>
              <TouchableOpacity onPress={hidePopup}></TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.floatingButton}
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
        <ThemedText>HERE</ThemedText>
      </TouchableOpacity>
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
    bottom: 20,
    right: 20,
    backgroundColor: "salmon",
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  popupContainer: {
    position: "absolute",
    bottom: 40,
    left: 16,
    right: 16,
    alignItems: "center",
  },
  popup: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    width: "100%",
  },
  popupTitle: {
    fontWeight: "bold",
    fontSize: 16,
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
