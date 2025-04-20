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

type Task = {
  task_id: number;
  title: string;
  description: string | null;
  done: boolean;
  created_at: Date;
  lng: number;
  lat: number;
};

const TasksContext = createContext<{
  tasks: Task[];
}>({
  tasks: [],
});

export function TasksContextProvider({ children }: PropsWithChildren) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const { session } = UserAuth();

  useEffect(() => {
    if (!session) return;
    const fetchTasks = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching authenticated user:", userError);
        return;
      }

      const email = user?.email;
      console.log("User email:", email);

      const { data, error } = await supabase.rpc("get_tasks_by_user_email", {
        email: email,
      });

      if (error) {
        console.error("error:", error);
        return null;
      }

      const newData = await mapTaskImages(data)

      setTasks(newData);
    };

    fetchTasks().then();
  }, [session]);

  const mapTaskImages = async (data: any) => {
    const images = await getLocalTaskImages(session)

    if (!images) return data

    data.map((item: any) => {
      const match = images.find((img: any) => img.id == item.task_id)

      if (match) {
        item.uri = match.image
      }
    })

    return data
  }

  return (
    <TasksContext.Provider value={{ tasks }}>{children}</TasksContext.Provider>
  );
}

export function UserTasks() {
  return useContext(TasksContext);
}
