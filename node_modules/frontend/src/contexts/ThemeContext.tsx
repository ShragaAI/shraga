import {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createTheme,
  CssBaseline,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material";

type ThemeContextData = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  chatBackground?: string;
  setChatBackground: (imgUrl: string) => void;
};

type ThemeProviderProps = {
  children: ReactElement;
};

const ThemeContext = createContext<ThemeContextData | null>(null);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

function getInitialTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "light" || theme === "dark") {
    return theme;
  }
  return "light";
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme());

  const [chatBackground, setChatBackground] = useState<string>();

  const muiTheme = createTheme({
    palette: {
      mode: theme,
    },
  });

  useEffect(() => {
    if (theme === "dark") {
      // Tailwind dark mode
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, chatBackground, setChatBackground }}>
      <MUIThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}
