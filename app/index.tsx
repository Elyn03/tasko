import { Button, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";
import { useEffect, useState } from "react";
import { Session } from "node:inspector";
import { supabase } from "@/lib/supabase";
// import { ParamListBase, useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { UserTasks } from "@/context/TaskManager";
import Task from "@/components/Task";

export default function HomeScreen() {
  const [session, setSession] = useState<Session | null>(null);
  // const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const { tasks } = UserTasks();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: any } }) => {
      if (session) {
        setSession(session);
      }
    });
    supabase.auth.onAuthStateChange((_event, session: any) => {
      setSession(session);
    });
  }, []);
  /* 
  const click = () => {
    console.log(session);
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigation.navigate("SignIn");
      // Session will be cleared automatically by the onAuthStateChange listener
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }; */

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={{ paddingTop: 16, paddingLeft: 16 }}>
        Vos tâches :
      </ThemedText>
      <ThemedView
        style={{
          display: "flex",
          padding: 16,
        }}
        showHeader={false}
      >
        {tasks.map((task) => (
          <Task key={task.task_id} {...task} />
        ))}
      </ThemedView>

      {/* Login overlay that appears when not logged in */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  loginContainer: {
    padding: 0,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});
