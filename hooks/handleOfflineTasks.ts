import AsyncStorage from "@react-native-async-storage/async-storage";
import {supabase} from "@/lib/supabase";

type ITask = {
    user_id: number;
    title: string,
    description: string | null,
    location: string,
}
const key = "offline-tasks"

export const getLocalOfflineTasks = async () => {
    const offlineTasks = await AsyncStorage.getItem(key)

    if (offlineTasks) {
        return {
            success: true,
            tasks: JSON.parse(offlineTasks)
        }
    }

    return {
        success: false,
        tasks: []
    }
}

export const storeLocalOfflineTask = async (newOfflineTask: ITask) => {
    try {
        const data = await getLocalOfflineTasks();
        const offlineTasks: ITask[] = data.tasks ?? data ?? [];
        const insertData = [newOfflineTask, ...offlineTasks];

        await AsyncStorage.setItem(key, JSON.stringify(insertData))

        return { success: true }
    } catch (err) {
        console.log("ERROR when save task offline")
        return { success: false }
    }
}

export const storeDatabaseOfflineTask = async () => {
    const localOfflineTasks = await getLocalOfflineTasks()
    const offlineTasks = localOfflineTasks.tasks

    if (offlineTasks.length > 0) {
        const { error } = await supabase
            .from("tasks")
            .insert(offlineTasks)

        if (error) console.log("ERROR: store offline tasks in database", error)

        await AsyncStorage.removeItem(key)
    }
}