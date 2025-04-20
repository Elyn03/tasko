import {
  View,
  StyleSheet,
  Text,
  Image,
  Animated,
  PanResponder,
} from "react-native";
import { Colors } from "@/constants/Colors";
import app from "@/app.json";
import { useEffect, useState, useRef } from "react";
import { getAddressFromCoords } from "@/lib/getAddressFromCoords";
import { UserTasks } from "@/context/TaskManager";

type Address = {
  house_number: string;
  road: string;
  city: string;
  railway: string;
};

const Task = (task: any) => {
  const lat = task.lat;
  const lng = task.lng;
  const apiKey = app.expo.android.config.googleMaps.apiKey;
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&markers=color:red%7C${lat},${lng}&key=${apiKey}`;

  const [address, setAddress] = useState<Address | null>(null);
  const [show, setShow] = useState(true);

  const { house_number: houseNumber, road, city, railway } = address || {};
  const parts = [railway, houseNumber, road, city, railway].filter(Boolean);
  const title = parts.join(", ");

  const { markAsDone } = UserTasks();
  const finished = task.done;

  useEffect(() => {
    const fetchAddress = async () => {
      const { address } = await getAddressFromCoords(task.lat, task.lng);
      setAddress(address);
    };
    fetchAddress().then();
  }, [task]);

  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dx }) => Math.abs(dx) > 10,
      onPanResponderMove: (_, { dx }) => {
        if (dx < 0) translateX.setValue(dx);
      },
      onPanResponderRelease: (_, { dx }) => {
        const shouldDismiss = dx < -100;

        if (shouldDismiss) {
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: -500,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setShow(false);
            markAsDone(task.task_id);
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!show) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: finished ? Colors.salmon : Colors.teal },
        { transform: [{ translateX }], opacity },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.description}>{title || "Loading address..."}</Text>
      </View>
      <Image source={{ uri: task.uri || mapUrl }} style={styles.map} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,

    borderRadius: 10,
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
