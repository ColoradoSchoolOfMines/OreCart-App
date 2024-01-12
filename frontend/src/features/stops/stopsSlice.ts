import apiSlice from "../../app/apiSlice";
import { type Coordinate } from "../location/locationSlice";

/**
 * A list of stops, as defined by the backend.
 */
export type Stops = ExtendedStop[];

/**
 * A Stop, as defined by the backend.
 */
export interface ExtendedStop extends Coordinate {
  id: number;
  name: string;
  routeIds: number[];
  isActive: boolean;
}

export interface BasicStop extends Coordinate {
  id: number;
  name: string;
  routeIds: number[];
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
    getStop: builder.query<BasicStop, number>({
      query: (id) => `/stops/${id}?include=routeIds&include=isActive`,
      providesTags: (_, __, id) => [{ type: "Stop", id }],
    }),
  }),
});

/**
 * Hook for querying the list of stops.
 */
export const { useGetStopsQuery, useGetStopQuery } = stopsApiSlice;
