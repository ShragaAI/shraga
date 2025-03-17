import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { Email, Google, Microsoft } from "@mui/icons-material";
import { Button, Input, CircularProgress } from "@mui/material";

import { useAuthContext, LoginMethod } from "../contexts/AuthContext";

interface oAuthKeys {
  google?: string;
  microsoft?: string;
}

export default function Login() {
  const { login, loginMethods, user } = useAuthContext();
  const [showEmailLogin, setShowEmailLogin] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loginProgress, setLoginProgress] = useState(false);
  const [oAuthKeys, setOAuthKeys] = useState<oAuthKeys>({});
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleEmailLogin = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  useEffect(() => {
    const getOAuthClientIds = async () => {
      try {
        const response = await fetch(`/oauth/keys`, {
          method: "GET"
        });
  
        if (!response.ok) {
          throw new Error(`Failed receiving client ids`);
        }
  
        const data = await response.json();
        setOAuthKeys(data);
  
      } catch (error) {
        console.error("Data receiving error:", error);
      }
    }

    getOAuthClientIds();
  }, []);

  const handleGoogleLogin = async () => {
    if(!oAuthKeys || !oAuthKeys.google) return;

    const oAuthRedirectUri = window.location.origin;
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${oAuthKeys.google}&redirect_uri=${oAuthRedirectUri}&scope=email&response_type=code&state=google`;
    window.location.href = authUrl;
  };

  const handleMicrosoftLogin = async () => {
    if(!oAuthKeys || !oAuthKeys.microsoft) return;
    
    const oAuthRedirectUri = window.location.origin;
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${oAuthKeys.microsoft}&response_type=code&redirect_uri=${oAuthRedirectUri}&scope=user.read&state=microsoft`;
    window.location.href = authUrl;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLoginError("");
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (submitted) {
      setLoginProgress(true);
      setSubmitted(false);
      login(
        { username: inputs.email, password: inputs.password },
        {
          onSuccess: () => {
            setLoginProgress(false);
            navigate("/");
          },
          onError: (err) => {
            setLoginProgress(false);
            setLoginError(err.message || "error");
          },
        }
      );
    }
  }, [submitted, inputs]);

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col h-full w-full p-4 space-y-4 max-w-md mx-auto justify-center">
      <Button
        variant="contained"
        className="p-2 space-x-2"
        onClick={() => setShowEmailLogin(true)}
      >
        <Email />
        <span>Email Login</span>
      </Button>
      {showEmailLogin && (
        <form
          onSubmit={handleEmailLogin}
          className="flex flex-col space-y-4 mt-4 pb-8"
        >
          <Input
            type="email"
            placeholder="Email"
            name="email"
            value={inputs.email || ""}
            onChange={handleChange}
            className="p-2"
          />
          <Input
            type="password"
            placeholder="Password"
            name="password"
            value={inputs.password || ""}
            onChange={handleChange}
            className="p-2"
          />
          {loginError && <div className="text-red-500">{loginError}</div>}
          <Button type="submit" className="p-2" disabled={loginProgress}>
            {loginProgress && <CircularProgress size={16} className={"mr-2"} />}
            Login
          </Button>
        </form>
      )}
      {loginMethods?.includes(LoginMethod.GOOGLE_LOGIN) && oAuthKeys.google && (
        <Button
          className="p-2 space-x-2"
          variant="contained"
          onClick={handleGoogleLogin}
        >
          <Google />
          <span>Google Login</span>
        </Button>
      )}
      {loginMethods?.includes(LoginMethod.MICROSOFT_LOGIN) && oAuthKeys.microsoft && (
        <Button
          className="p-2 space-x-2"
          variant="contained"
          onClick={handleMicrosoftLogin}
        >
          <Microsoft />
          <span>Microsoft Login</span>
        </Button>
      )}
    </div>
  );
}
