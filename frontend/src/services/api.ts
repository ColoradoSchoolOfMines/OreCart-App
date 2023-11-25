function getApiUrl(): string {
  if (process.env.NODE_ENV === "development") {
    return "http://" + process.env.EXPO_PUBLIC_DEV_API_URL;
  } else {
    return "https://" + process.env.EXPO_PUBLIC_PROD_API_URL;
  }
}

export async function apiGet<T>(route: string): Promise<T> {
  const url = getApiUrl() + route
  return await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(async (response) => await response.json());
}
