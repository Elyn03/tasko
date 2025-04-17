import { ThemedText } from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemedText>YOU CAN VIEW YOUR PROFILE HERE</ThemedText>
    </ThemedView>
  );
}
