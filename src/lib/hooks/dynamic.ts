import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export function useAuthToken() {
  const dynamicContext = useDynamicContext();

  const authToken = dynamicContext.authToken;

  if (authToken === undefined) {
    throw new Error("No auth token found");
  }

  return authToken;
}
