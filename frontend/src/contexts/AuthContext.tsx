import {
  ReactElement,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import useFetch from "../hooks/useFetch";
import { getAuthCookie, setAuthCookie } from "../utils/auth";

type User = {
  display_name: string;
  roles: string[];
};

export enum LoginMethod {
  BASIC_LOGIN = "basic",
  GOOGLE_LOGIN = "google",
  MICROSOFT_LOGIN = "microsoft",
  GITHUB_LOGIN = "github",
}

export interface LoginInputs {
  username: string;
  password: string;
}

type AuthContextData = {
  loginMethods?: [LoginMethod];
  user: User | undefined;
  appVersion?: string;
  isLoading: boolean;
  login: (
    input: LoginInputs,
    opts: {
      onSuccess?: (authData: string) => void;
      onError?: (err: any) => void;
    }
  ) => Promise<void>;
  logout: () => void;
};

type AuthProviderProps = {
  children: ReactElement;
};

const AuthContext = createContext<AuthContextData | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [appVersion, setAppVersion] = useState<string | undefined>();
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data: loginMethods } = useFetch<[LoginMethod]>("/auth/login_methods");

  useEffect(() => {
    if (window.location.hash.includes("jwt")) {
      const authToken = location.hash.split("jwt=")[1];
      setAuthCookie(`Bearer ${authToken}`);
      window.location.href = "/";
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    if (code && state) {
      handleOAuthCallback(code, state);
      return;
    }

    _fetchUser(getAuthCookie()).then(({ ok, data }) => {
      if (ok) {
        setUser(data);
        setAppVersion(data.shraga_version);
      }
      setIsLoading(false);
    });
  }, []);

  const handleOAuthCallback = async (code: string, state: string) => {
    if (state !== "google" && state !== "microsoft") {
      throw new Error("Invalid state");
    }

    try {
      const response = await fetch(`/oauth/${state}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, redirect_uri: window.location.origin }),
      });

      if (!response.ok) {
        throw new Error("Failed the authenticate with Google");
      }

      const data = await response.json();
      setAuthCookie(`${state} ${data.token}`);

      const { ok, data: userData } = await _fetchUser(data.token);
      if (ok) {
        setUser(userData);
        setAppVersion(userData.shraga_version);
      }
      window.location.href = "/";
    } catch (error) {
      console.error("OAuth error:", error);
    }
  };

  const _fetchUser = async (
    authToken: string | null
  ): Promise<{ ok: boolean; data: any }> => {
    const res = await fetch("/api/whoami", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ?? "",
      },
    });
    const data = await res.json();
    return { ok: res.ok, data };
  };

  const login = async (
    inputs: LoginInputs,
    {
      onSuccess,
      onError,
    }: {
      onSuccess?: (authData: string) => void;
      onError?: (err: any) => void;
    }
  ) => {
    const basicAuthString = `Basic ${btoa(
      `${inputs.username}:${inputs.password}`
    )}`;
    try {
      if (!inputs.username || !inputs.password) {
        throw new Error("Email and password are required.");
      }
      const { ok, data } = await _fetchUser(basicAuthString);
      if (ok) {
        setUser(data);
        setAppVersion(data.shraga_version);
        setAuthCookie(basicAuthString);
        onSuccess?.(basicAuthString);
      } else {
        const errMessage = data.detail;
        throw new Error(errMessage);
      }
    } catch (err: any) {
      onError?.(err);
    }
  };

  const logout = () => {
    // Perform logout
    setUser(undefined);
    setAuthCookie(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        loginMethods,
        user,
        appVersion,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
