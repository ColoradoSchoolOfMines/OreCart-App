export type RequestState<T> = Ok<T> | Error | Loading;

interface Ok<T> {
  type: "ok";
  data: T;
}

interface Error {
  type: "error";
  message: string;
}

interface Loading {
  type: "loading";
}

function getApiUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL == null) {
    throw new Error("API URL not set");
  }
  return process.env.EXPO_PUBLIC_API_URL;
}

export async function apiGet<T>(route: string): Promise<T> {
  const url = getApiUrl() + route;
  return await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(async (response) => await response.json());
}
