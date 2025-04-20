import { Button, StyleSheet, Switch, View } from "react-native";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedText } from "@/components/themed/ThemedText";
import { useEffect, useState } from "react";
import { Session } from "node:inspector";
import { supabase } from "@/lib/supabase";

import { UserTasks } from "@/context/TaskManager";
import Task from "@/components/Task";
import { Task as TaskType } from "@/context/TaskManager";
import { Colors } from "react-native/Libraries/NewAppScreen";

const sortingTasks: Array<"time" | "distance"> = ["time", "distance"];

export default function HomeScreen() {
  const [unfinishedTasks, setUnfinishedTasks] = useState<TaskType[]>([]);
  const [finishedTasks, setFinishedTasks] = useState<TaskType[]>([]);
  const [sortedType, setSortedType] = useState<boolean>(true);
  const { tasks } = UserTasks();

  useEffect(() => {
    const unfinished = tasks.filter((task) => !task.done);
    const finished = tasks.filter((task) => task.done);

    setUnfinishedTasks(unfinished);
    setFinishedTasks(finished);
  }, [tasks]);

  function toggleSortedType(value: boolean): void | Promise<void> {
    const sortedByDate = unfinishedTasks
      .map((task) => ({
        ...task,
        time: task.created_at ? -+new Date(task.created_at) : 0,
      }))
      .sort(
        (a, b) =>
          (a[sortingTasks[+value]] as number) -
          (b[sortingTasks[+value]] as number)
      );
    console.log(
      "sortedByDate",
      sortedByDate.map(({ distance }) => distance)
    );
    console.log(
      "created_at",
      sortedByDate.map(({ time }) => time)
    );

    setUnfinishedTasks(sortedByDate);
    setSortedType(value);
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.container} showHeader={false}>
        <ThemedText type="title" style={{ paddingTop: 16, paddingLeft: 16 }}>
          Vos tâches en cours :
        </ThemedText>
        <View style={styles.sortContainer}>
          <Switch
            trackColor={{ false: Colors.teal, true: Colors.pinkSalmon }}
            thumbColor={Colors.salmon}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSortedType}
            value={sortedType}
          />
          <ThemedText>
            Trier par : {sortedType ? "Distance" : "Date"}
          </ThemedText>
        </View>
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

  sortContainer: {
    display: "flex",
    flexDirection: "row",
    padding: 16,
  },
});
