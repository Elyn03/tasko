import {
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  Text,
  Animated,
  Easing,
} from "react-native";
import MapView, { Marker, MapPressEvent, Callout } from "react-native-maps";
import findLocalisation from "@/hooks/findLocalisation";
import React, { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";
// import { AppleMaps, GoogleMaps } from "expo-maps";

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [pins, setPins] = useState<{ latitude: number; longitude: number }[]>(
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
    outputRange: [200, 0], // start off screen
  });

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setPins((prevPins) => [...prevPins, { latitude, longitude }]);
  };

  return (
    <ThemedView showHeader={false}>
      {localisation ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          onPress={handleMapPress}
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
          {pins.map((pin, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
              onPress={() => {
                console.log(pin.latitude, pin.longitude);
                setSelectedCoord({
                  latitude: pin.latitude,
                  longitude: pin.longitude,
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
              <TouchableOpacity onPress={hidePopup}>
                <Text style={styles.closeBtn}>Fermer</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      )}

      {/*       <TouchableOpacity
        style={styles.floatingButton}
        // onPress={() => {
        //   if (localisation) {
        //     mapRef.current?.animateToRegion({
        //       latitude: localisation.coords.latitude,
        //       longitude: localisation.coords.longitude,
        //       latitudeDelta: 0.01,
        //       longitudeDelta: 0.01,
        //     });
        //   }
        // }}
      >
        <ThemedText>HERE</ThemedText>
      </TouchableOpacity> */}
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
  closeBtn: {
    color: "blue",
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "right",
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

{
  /*       {localisation ? (
        <GoogleMaps.View
          cameraPosition={{
            coordinates: { latitude, longitude },
            zoom: 15,
          }}
          markers={[
            {
              coordinates: { latitude, longitude },
              title: "My Location",
              snippet: "This is my location",
              showCallout: true,
            },
          ]}
          style={styles.map}
        />
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
      )} */
}
{
  /*       {Platform.OS === "ios" ? (
        <AppleMaps.View style={{ flex: 1 }} />
      ) : Platform.OS === "android" ? (
        <GoogleMaps.View style={{ flex: 1 }} />
      ) : (
        <Text>Maps are only available on Android and iOS</Text>
      )} */
}
