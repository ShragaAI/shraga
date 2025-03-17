import useSWR from "swr";

import { fetcher } from "./useFetch";
import { Flow } from "../contexts/AppContext";
import { getAuthCookie } from "../utils/auth";

export default function useFlowsWithPreferences() {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };

  const authString = getAuthCookie();
  if (authString) {
    headers["Authorization"] = authString;
  }

  const { data, error, mutate, isValidating, isLoading } = useSWR<Flow[]>(
    "flows_with_preferences",
    async () => {
      const flows: Flow[] = await fetcher("/api/flows/", {
        headers,
      });
      return flows;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return { data, error, mutate, isValidating, isLoading };
}
