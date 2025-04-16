import { Text, View } from "react-native";
import {ThemedView} from "@/components/ThemedView";

export default function StoreScreen() {
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>HERE THE IN-APP PURCHASE STORE /!\ NOT AVAILABLE YET /!\</Text>
    </ThemedView>
  );
}
