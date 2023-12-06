function getApiUrl(): string {
  if (process.env.EXPO_PUBLIC_API_DOMAIN == null) {
    throw new Error("API URL not set");
  }
  return "http://" + process.env.EXPO_PUBLIC_API_DOMAIN;
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
