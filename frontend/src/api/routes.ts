import { type Coordinate } from '../services/location';

import apiSlice from './apiSlice'

export type Routes = Route[];

export interface Route {
  id: string;
  name: string;
  stopIds: number[];
  waypoints: Coordinate[];
  isActive: boolean;
}

export const routesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getRoutes: builder.query({
      query: () => '/routes/?include=stopIds&include=waypoints&include=isActive',
      providesTags: ["Routes"]
    })
  })
})

export const { useGetRoutesQuery } = routesApiSlice