import { Button, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";
import { useEffect, useState } from "react";
import { Session } from "node:inspector";
import { supabase } from "@/lib/supabase";

import { UserTasks } from "@/context/TaskManager";
import Task from "@/components/Task";
import { Task as TaskType } from "@/context/TaskManager";

export default function HomeScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [unfinishedTasks, setUnfinishedTasks] = useState<TaskType[]>([]);
  const [finishedTasks, setFinishedTasks] = useState<TaskType[]>([]);
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

  useEffect(() => {
    const unfinished = tasks.filter((task) => !task.done);
    const finished = tasks.filter((task) => task.done);
    console.log("Unfinished tasks:", unfinished);
    console.log("Finished tasks:", finished);

    setUnfinishedTasks(unfinished);
    setFinishedTasks(finished);
  }, [tasks]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.container} showHeader={false}>
        <ThemedText type="title" style={{ paddingTop: 16, paddingLeft: 16 }}>
          Vos tâches en cours :
        </ThemedText>
        <ThemedView
          style={{
            display: "flex",
            padding: 16,
          }}
          showHeader={false}
        >
          {unfinishedTasks &&
            unfinishedTasks.map((task) => (
              <Task key={task.task_id} {...task} />
            ))}
        </ThemedView>

        {/* Login overlay that appears when not logged in */}
      </ThemedView>
      <ThemedView style={styles.container} showHeader={false}>
        <ThemedText type="title" style={{ paddingTop: 16, paddingLeft: 16 }}>
          Vos tâches terminées :
        </ThemedText>
        <ThemedView
          style={{
            display: "flex",
            padding: 16,
          }}
          showHeader={false}
        >
          {finishedTasks &&
            finishedTasks.map((task) => <Task key={task.task_id} {...task} />)}
        </ThemedView>

        {/* Login overlay that appears when not logged in */}
      </ThemedView>
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
