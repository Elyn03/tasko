import { View, StyleSheet, Text, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import app from "@/app.json";
import { useEffect, useState } from "react";
import { getAddressFromCoords } from "@/lib/getAddressFromCoords";

type Address = {
  house_number: string;
  road: string;
  city: string;
  railway: string;
};

const Task = (task: any) => {
  const lat = task.lat;
  const lng = task.lng;

  // Get static map from Google Maps API
  const apiKey = app.expo.android.config.googleMaps.apiKey;
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&markers=color:red%7C${lat},${lng}&key=${apiKey}`;

  const [address, setAddress] = useState<Address | null>(null);
  const { house_number: houseNumber, road, city, railway } = address || {};
  const parts = [railway, houseNumber, road, city, railway].filter(Boolean);
  const title = parts.join(", ");

  useEffect(() => {
    const fetchAddress = async () => {
      const { address } = await getAddressFromCoords(task.lat, task.lng);
      setAddress(address);
    };
    fetchAddress().then();
  }, [task]);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.description}>{title || "Loading address..."}</Text>
      </View>

      <Image source={{ uri: task.uri ? task.uri : mapUrl }} style={styles.map} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: Colors.teal,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  description: {
    color: "white",
    maxWidth: "100%",
  },
  map: {
    width: 150,
    height: 120,
    borderRadius: 10,
  },
});
export default Task;
