import apiSlice from "../../app/apiSlice";
import { type Coordinate } from "../location/locationSlice";

/**
 * A list of routes, as defined by the backend.
 */
export type Routes = ExtendedRoute[];

export interface BasicRoute {
  id: number,
  name: string,
  stopIds: number[],
}

/**
 * A Route, as defined by the backend.
 */
export interface ExtendedRoute extends BasicRoute {
  waypoints: Coordinate[];
  isActive: boolean;
}

// --- API Definition ---

/**
 * This slice extends the existing API slice with the route information route.
 * There should be no state to reason about here, it's just configuration.
 */
const routesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getRoutes: builder.query<Routes, void>({
      query: () =>
        "/routes/?include=stopIds&include=waypoints&include=isActive",
      providesTags: ["Routes"],
    }),
    getRoute: builder.query<BasicRoute, number>({
      query: (id) => `/routes/${id}?include=stopIds`,
      providesTags: (_, __, id) => [{ type: "Route", id }],
    }),
  }),
});

/**
 * Hook for querying the list of routes.
 */
export const { useGetRoutesQuery, useGetRouteQuery } = routesApiSlice;
