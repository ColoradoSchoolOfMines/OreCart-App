import apiSlice from "../../app/apiSlice";
import { type Coordinate } from "../location/locationSlice";
import { type Route } from "../routes/routesSlice";

export interface Stop extends Coordinate {
  id: number;
  name: string;
  isActive: boolean;
}

export interface ColorStop extends Stop {
  colors: string[];
}

export interface ParentStop extends Stop {
  routes: Route[];
}

// --- API Definition ---

/**
 * This slice extends the existing API slice with the stop information routes.
 * There should be no state to reason about here, it's just configuration.
 */
const stopsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getStops: builder.query<ColorStop[], void>({
      query: () => "/stops/?include=colors&include=isActive",
      providesTags: ["Stops"],
    }),
    getStop: builder.query<ParentStop, number>({
      query: (id) => `/stops/${id}?include=routes&include=isActive`,
      providesTags: (_, __, id) => [{ type: "Stop", id }],
    }),
  }),
});

/**
 * Hook for querying the list of stops.
  | GenericPerspective
 */
export const { useGetStopsQuery, useGetStopQuery } = stopsApiSlice;
