import { Text, View } from "react-native";
import {ThemedView} from "@/components/ThemedView";

export default function MapScreen() {
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>HERE IS YOUR MAP WITH YOUR TASKS IN IT</Text>
    </ThemedView>
  );
}
