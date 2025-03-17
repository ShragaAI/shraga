import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import { CircularProgress } from "@mui/material";

import classNames from "classnames";
import Analytics from "./components/Analytics/Analytics";
import Chat from "./components/Chat/Chat";
import ChatInput from "./components/Chat/ChatInput";
import Header from "./components/Header";
import Login from "./components/Login";
import SessionModal from "./components/SessionEditor/SessionEditorModal";
import SettingsModal from "./components/Settings/SettingsModal";
import Sidebar from "./components/Sidebar";
import AppProvider, { useAppContext } from "./contexts/AppContext";
import { useAuthContext } from "./contexts/AuthContext";
import { useThemeContext } from "./contexts/ThemeContext";
import AnalyticsLayout from "./layouts/AnalyticsLayout";

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRoles?: string[];
}

interface AppProps {
  ChatComponent?: React.ComponentType;
}

function App(props: AppProps) {
  const { user, isLoading } = useAuthContext();
  const { chatBackground, theme } = useThemeContext();

  if (isLoading) {
    return (
      <div className="flex h-full justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  const Layout = () => {
    const { configs, isSidebarOpen, toggleSidebar } = useAppContext();
    const defaultFlow = configs?.default_flow;
    const sessionModal = configs?.list_flows || (Array.isArray(defaultFlow) && defaultFlow.length > 1) ? <SessionModal /> : null;

    if (!configs) {
      return (
        <div className="flex h-full justify-center items-center">
          <CircularProgress />
        </div>
      );
    }

    const ChatCls = props.ChatComponent || Chat;

    return (
      <div className="relative flex h-full w-full">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="relative flex-1">
          <main className="flex flex-col flex-1 h-full overflow-auto z-10">
            <Header
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
            <div className="flex flex-1 justify-center px-2">
              <div className="w-full flex flex-col max-w-[768px]">
                <div className="flex-1 overflow-auto">
                  <ChatCls />
                </div>
                <ChatInput />
              </div>
            </div>
          </main>
          <div
            className={classNames("absolute inset-0 mt-14 z-[-1]", {
              "bg-cover bg-center": !!chatBackground,
            })}
            style={{
              backgroundImage: chatBackground
                ? `url(${chatBackground})`
                : undefined,
              filter: theme === "dark" ? "invert(1)" : undefined,
            }}
          />
        </div>

        {sessionModal}
        <SettingsModal />
      </div>
    );
  };

  const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
    if (!user) {
      return <Navigate to="/login" />;
    }

    if (
      requiredRoles &&
      (!user.roles || !requiredRoles.every((role) => user.roles.includes(role)))
    ) {
      return <Navigate to="/" />;
    }

    return <AppProvider>{children}</AppProvider>;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
    },
    {
      path: "/analytics",
      element: (
        <ProtectedRoute requiredRoles={["analytics"]}>
          <AnalyticsLayout>
            <Analytics />
          </AnalyticsLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return (
    <div className="h-full w-full">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
