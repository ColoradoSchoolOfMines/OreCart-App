import { type Coordinate } from "../services/location";

import apiSlice from "./apiSlice";

export type Routes = Route[];

export interface Route {
  id: string;
  name: string;
  stopIds: number[];
  waypoints: Coordinate[];
  isActive: boolean;
}

const routesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getRoutes: builder.query<Routes, void>({
      query: () =>
        "/routes/?include=stopIds&include=waypoints&include=isActive",
      providesTags: ["Routes"],
    }),
  }),
});

export const { useGetRoutesQuery } = routesApiSlice;
