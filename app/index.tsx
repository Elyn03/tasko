import { ThemedView } from "@/components/themed/ThemedView";
import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>HERE IS THE LIST OF YOUR TASKS</Text>
    </ThemedView>
  );
}
