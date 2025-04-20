import {
  createContext,
  useState,
  useEffect,
  useContext,
  PropsWithChildren,
} from "react";
import { supabase } from "@/lib/supabase";
import { UserAuth } from "@/context/AuthContext";
import { getLocalTaskImages } from "@/hooks/handleLocalStorage";
import findLocalisation from "@/hooks/findLocalisation";

export type Task = {
  task_id: number;
  title: string;
  description: string | null;
  done: boolean;
  created_at: Date | number;
  lng: number;
  lat: number;
  distance: number;
  time: number;
};

const TasksContext = createContext<{
  tasks: Task[];
  markAsDone: (taskId: number) => Promise<void>;
  fetchTasks: () => Promise<null | undefined>;
}>({
  tasks: [],
  markAsDone: async () => {},
  fetchTasks: async () => null,
});

export function TasksContextProvider({ children }: PropsWithChildren) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const { session } = UserAuth();

  const userLocalisation = findLocalisation();

  const mapTaskImages = async (data: any) => {
    const images = await getLocalTaskImages(session);

    if (!images) return data;

    data.map((item: any) => {
      const match = images.find((img: any) => img.id == item.task_id);

      if (match) {
        item.uri = match.image;
      }
    });

    return data;
  };

  const fetchTasks = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error fetching authenticated user:", userError);
      return null;
    }

    const email = user?.email;
    console.log("User email:", email);

    const { data, error } = await supabase.rpc("get_tasks_by_user_email", {
      email,
      userlat: userLocalisation?.coords.latitude,
      userlng: userLocalisation?.coords.longitude,
    });

    if (error) {
      console.error("error:", error);
      return null;
    }
    const newData = await mapTaskImages(data);

    setTasks(newData);
  };

  useEffect(() => {
    if (!session) return;

    fetchTasks();
  }, [session]);

  const markAsDone = async (taskId: number) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ done: true })
        .eq("id", taskId);

      if (error) {
        console.error("Erreur markAsDone:", error);
        return;
      }

      fetchTasks();
    } catch (err) {
      console.error("Erreur inattendue markAsDone:", err);
    }
  };

  return (
    <TasksContext.Provider value={{ tasks, markAsDone, fetchTasks }}>
      {children}
    </TasksContext.Provider>
  );
}

export function UserTasks() {
  return useContext(TasksContext);
}
