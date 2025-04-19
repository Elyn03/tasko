import {
  createContext,
  useState,
  useEffect,
  useContext,
  PropsWithChildren,
} from "react";
import { useColorScheme } from "@/hooks/useColorScheme";

type ITheme = "light" | "dark";

const ThemeContext = createContext<{
  theme: ITheme;
  toggleTheme: () => void;
}>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeContextProvider({ children }: PropsWithChildren) {
  const deviceTheme = useColorScheme() ?? "light";
  const [theme, setTheme] = useState<ITheme>("light");

  useEffect(() => {
    setTheme(deviceTheme);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function AppTheme() {
  return useContext(ThemeContext);
}
