import { ThemedView } from "@/components/themed/ThemedView";
import { Text, View } from "react-native";

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
