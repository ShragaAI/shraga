import useSWR from "swr";
import { BareFetcher, PublicConfiguration } from "swr/_internal";
import { toast } from "react-toastify";

import { getAuthCookie } from "../utils/auth";

export async function fetcher(path: string, opts = {} as RequestInit) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
    },
    ...opts,
  });

  const data = await response.json();
  if (response.ok) {
    return data;
  }
  data.error && toast.error(data.error);
  throw new Error();
}

export default function useFetch<T = any>(
  path: string,
  opts = {} as RequestInit,
  config?: Partial<PublicConfiguration<T, any, BareFetcher<T>>>
) {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };

  const authString = getAuthCookie();
  if (authString) {
    headers["Authorization"] = authString;
  }

  const { data, error, mutate, isValidating, isLoading } = useSWR<T>(
    path,
    (path: string) =>
      fetcher(path, {
        headers: headers,
        ...opts,
      }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      ...config,
    }
  );

  return { data, error, mutate, isValidating, isLoading };
}
