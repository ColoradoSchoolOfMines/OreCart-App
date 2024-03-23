import apiSlice from "../../app/apiSlice";
import { type Coordinate } from "../location/locationSlice";
import { type Stop } from "../stops/stopsSlice";

export interface Route {
  id: number;
  name: string;
  isActive: boolean;
  color: string;
  waypoints: Coordinate[];
}

export interface ParentRoute extends Route {
  stops: Stop[];
  description: string;
}

// --- API Definition ---

/**
 * This slice extends the existing API slice with the route information route.
 * There should be no state to reason about here, it's just configuration.
 */
const routesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getRoutes: builder.query<Route[], void>({
      query: () => "/routes/?include=stops&include=waypoints&include=isActive",
      providesTags: ["Routes"],
    }),
    getRoute: builder.query<ParentRoute, number>({
      query: (id) =>
        `/routes/${id}?include=stops&include=waypoints&include=isActive`,
      providesTags: (_, __, id) => [{ type: "Route", id }],
    }),
  }),
});

/**
 * Hook for querying the list of routes.
 */
export const { useGetRoutesQuery, useGetRouteQuery } = routesApiSlice;
