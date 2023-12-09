import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

function getApiUrl(): string {
  if (process.env.EXPO_PUBLIC_API_DOMAIN == null) {
    throw new Error("API URL not set");
  }

  // http in development, https in production
  if (process.env.NODE_ENV === "development") {
    return "http://" + process.env.EXPO_PUBLIC_API_DOMAIN;
  } else {
    return "https://" + process.env.EXPO_PUBLIC_API_DOMAIN;
  }
}

export default createApi({
  baseQuery: fetchBaseQuery({ baseUrl: getApiUrl() }),
  tagTypes: ["Routes", "Vans"],
  endpoints: () => ({}), // All endpoints are injected
});
