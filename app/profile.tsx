import { Text, View } from "react-native";
import {ThemedView} from "@/components/ThemedView";

export default function ProfileScreen() {
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>YOU CAN VIEW YOUR PROFILE HERE</Text>
    </ThemedView>
  );
}
