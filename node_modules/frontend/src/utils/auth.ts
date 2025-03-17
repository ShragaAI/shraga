import { getCookie, setCookie, deleteCookie } from "./cookieUtils";

export const getAuthCookie = (): string | null => {
  return getCookie("auth");
};

export const setAuthCookie = (authString?: string): void => {
  if (authString) setCookie("auth", authString, 24);
  else deleteCookie("auth");
};
