import { ThemedView } from "@/components/themed/ThemedView";
import { Text, View } from "react-native";

export default function CreationScreen() {
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>HERE YOU CAN CREATE A NEW TASK</Text>
    </ThemedView>
  );
}
