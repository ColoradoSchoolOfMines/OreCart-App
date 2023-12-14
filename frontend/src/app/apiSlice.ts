import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

function getApiUrl(): string {
  // Avoid an obvious poor environment setup footgun
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

/**
 * The slice managing API fetching/result caching. Should not be used
 * outside of the data store. If you want to work with the API, look
 * at the exports of the other files in this module.
 */
export default createApi({
  baseQuery: fetchBaseQuery({ baseUrl: getApiUrl() }),
  tagTypes: ["Routes", "Vans"],
  endpoints: () => ({}), // All endpoints are injected by other files
});
