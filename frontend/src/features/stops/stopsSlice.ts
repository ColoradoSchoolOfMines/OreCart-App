import apiSlice from "../../app/apiSlice";
import { type Coordinate } from "../location/locationSlice";
import { type BasicRoute } from "../routes/routesSlice";

/**
 * A list of stops, as defined by the backend.
 */
export type Stops = Stop[];

/**
 * A Stop, as defined by the backend.
 */
export interface Stop extends Coordinate {
  id: number;
  name: string;
  routeIds: number[];
  isActive: boolean;
}

// --- API Definition ---

/**
 * This slice extends the existing API slice with the stop information routes.
 * There should be no state to reason about here, it's just configuration.
 */
const stopsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getStops: builder.query<Stops, void>({
      query: () => "/stops/?include=routeIds&include=isActive",
      providesTags: ["Stops"],
    }),
    getStop: builder.query<BasicRoute, number>({
      query: (id) => `/stops/${id}`,
      providesTags: (_, __, id) => [{ type: "Stop", id }],
    }),
  }),
});

/**
 * Hook for querying the list of stops.
 */
export const { useGetStopsQuery, useGetStopQuery } = stopsApiSlice;
