import {
  createContext,
  useState,
  useEffect,
  useContext,
  PropsWithChildren,
} from "react";
import { supabase } from "@/lib/supabase";
import { UserAuth } from "@/context/AuthContext";

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
      setTasks(data);
    };

    fetchTasks();
  }, [session]);

  return (
    <TasksContext.Provider value={{ tasks }}>{children}</TasksContext.Provider>
  );
}

export function UserTasks() {
  return useContext(TasksContext);
}
