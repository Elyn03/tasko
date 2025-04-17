import { ThemedView } from "@/components/themed/ThemedView";
import { Text, View } from "react-native";

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
