import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import MapView, {
  MapPressEvent,
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";

// File
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

// Components
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedButton } from "@/components/themed/ThemedButton";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";

// Context
import { UserAuth } from "@/context/AuthContext";
import { AppTheme } from "@/context/ThemeContext";
import { UserTasks } from "@/context/TaskManager";
import {AppNetwork} from "@/context/NetworkContext";

// Hooks
import { findUser } from "@/hooks/findUser";
import findLocalisation from "@/hooks/findLocalisation";
import {storeDatabaseOfflineTask, storeLocalOfflineTask} from "@/hooks/handleOfflineTasks";
import { insertTaskImage } from "@/hooks/handleLocalStorage";

// Constants
import { Colors } from "@/constants/Colors";
import { MapColors } from "@/constants/MapColors";

export default function CreationScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [position, setPosition] = useState("");
  const [coordinates, setCoordinates] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const fetchTasks = UserTasks();

  const mapRef = useRef<MapView>(null);
  const animation = useRef<LottieView>(null);

  const { session } = UserAuth();
  const { theme } = AppTheme()
  const { isConnected } = AppNetwork()

  useEffect(() => {
    console.log("position", position);
  }, [position]);

  const localisation = findLocalisation();
  const latitude = localisation?.coords.latitude || 0;
  const longitude = localisation?.coords.longitude || 0;

  const getPosition = () => {
    localisation
      ? setCoordinates([
          localisation.coords.longitude,
          localisation.coords.latitude,
        ])
      : null;
    setPosition(coordinates.join(" "));
  };
  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    setPosition(`${longitude} ${latitude}`);
    setCoordinates([longitude, latitude]);
  };

  const addImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission to access media library is required!");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images" as const,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const finalUri = result.assets[0].uri;
      const fileExists = await FileSystem.getInfoAsync(finalUri);
      if (fileExists.exists) {
        setImage(finalUri);
      }
    }
  };

  const createTask = async () => {
    let user = await findUser(session);

    if (!title) {
      setErrorMessage("Veuillez renseigner le titre !");
      return;
    }
    if (!position) {
      setErrorMessage("Veuillez renseigner une position !");
      return;
    }

    const payload = {
      user_id: user.id,
      title: title,
      description: description ? description : null,
      location: `POINT(${position})`,
    };

    const { data, error } = await supabase
      .from("tasks")
      .insert(payload)
      .select();

    if (data) {
      console.log("Task created:", data);
      await fetchTasks.fetchTasks();

      let imageToInsert = {
        id: data[0].id,
        image: image,
      };
      await insertTaskImage(session, imageToInsert);
    }

    if (isConnected) {
        await storeDatabaseOfflineTask()
    } else {
        await storeLocalOfflineTask(payload)
    }

    if (error) return { success: false, error: error };

    setTitle("");
    setDescription("");
    setPosition("");
    setErrorMessage("");
    setImage("");
    return { success: true };
  };

  return (
    <ThemedView showHeader={false}>
      <View style={styles.container}>
        <ThemedText type={"title"} style={styles.title}>
          Ajouter une nouvelle tâche
        </ThemedText>

        <View style={styles.inputContainer}>
          <ThemedText type={"default"}>Titre de la tâche*</ThemedText>
          <TextInput
            style={styles.taskInput}
            onChangeText={(text) => {
              setTitle(text);
              setErrorMessage("");
            }}
            value={title}
            autoCapitalize={"none"}
            placeholder="Titre de la tâche"
          />
        </View>

        <View style={styles.inputContainer}>
          <ThemedText type={"default"}>Description de la tâche</ThemedText>
          <TextInput
            style={styles.taskInput}
            onChangeText={(text) => setDescription(text)}
            value={description}
            autoCapitalize={"none"}
            placeholder="Description (facultatif)"
          />
        </View>

        <View style={styles.inputContainer}>
          <ThemedText type={"default"}>Image</ThemedText>
          <ThemedButton title={"Ajouter une image"} onPress={addImage} />
        </View>
        {image && (
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: image,
              }}
              style={styles.image}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <ThemedText type={"default"}>Position*</ThemedText>
          <View style={styles.mapPositionContainer}>
            <TextInput
              style={[styles.taskInput, styles.positionInput]}
              onChangeText={(text) => {
                setPosition(text);
                setErrorMessage("");
              }}
              value={position}
              autoCapitalize={"none"}
              placeholder="Position"
              numberOfLines={1}
              multiline={false}
            />
            <TouchableOpacity onPress={getPosition}>
              <Ionicons
                name={"locate"}
                size={36}
                color={theme === "light" ? Colors.darkTeal : Colors.pinkSalmon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.imageContainer}>
          {localisation ? (
            <MapView
              ref={mapRef}
              style={styles.image}
              onPress={handleMapPress}
              provider={PROVIDER_GOOGLE}
              customMapStyle={
                theme === "light" ? MapColors.light : MapColors.dark
              }
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
            >
              <Marker
                coordinate={{
                  latitude: coordinates[1] || latitude,
                  longitude: coordinates[0] || longitude,
                }}
                onPress={() => {
                  mapRef.current?.animateToRegion(
                    {
                      latitude: coordinates[1],
                      longitude: coordinates[0],
                      latitudeDelta: 0.05,
                      longitudeDelta: 0.05,
                    },

                    1000
                  );
                }}
              />
            </MapView>
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={{ color: "white" }}>Chargement de la carte ...</Text>
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
        </View>

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <ThemedButton type={"default"} title={"Ajouter"} onPress={createTask} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 24,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    textAlign: "center",
  },
  taskInput: {
    padding: 12,
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "#FEFEFF",
    borderColor: "#757575",
  },
  imageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#444",
    borderRadius: 8,
    overflow: "hidden",
  },
  mapPositionContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  positionInput: {
    width: "85%",
  },
  errorText: {
    color: "#c32a2a",
    fontStyle: "italic",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
});
