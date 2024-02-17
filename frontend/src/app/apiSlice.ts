import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Constants from "expo-constants";

/**
 * The slice managing API fetching/result caching. Should not be used
 * outside of the data store. If you want to work with the API, look
 * at the exports of the other files in this module.
 *
 * While this is a slice, it has no internal state that we declared.
 * Redux Toolkit Query (RTK Query) handles effectively all of this and
 * exposes API hooks for us that are nearly equivalent to something
 * like React Query.
 *
 * If you need to connect to a new API, you will need to create a new slice
 * (and corresponding) interfaces, import this slice, and then call `injectEndpoints`
 * on it with the new endpoint URL and types. You will also need to add a new tag
 * to tagTypes here, and use the same tag in the new slice. You can find other
 * examples in the codebase at features/routes/routesSlice.ts, features/stops/stopsSlice.ts,
 * features/vans/vansSlice.ts, etc. if this is a bit confusing.
 */
export default createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: Constants.expoConfig?.extra?.httpApiUrl,
  }),
  tagTypes: [
    "ActiveAlerts",
    "FutureAlerts",
    "Routes",
    "Route",
    "Stops",
    "Stop",
    "Vans",
  ],
  endpoints: () => ({}), // All endpoints are injected by other files
});
