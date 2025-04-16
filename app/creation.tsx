import { Text, View } from "react-native";
import {ThemedView} from "@/components/ThemedView";

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
