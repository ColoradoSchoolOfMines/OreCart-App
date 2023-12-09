import {
  createSlice,
  type Middleware,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { useAppSelector } from "../data/util";
import { type Coordinate } from "../services/location";

import apiSlice from "./apiSlice";

export type Vans = Van[];

export interface Van {
  id: number;
  routeId: number;
  wheelchair: boolean;
}

const vansApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getVans: builder.query<Vans, void>({
      query: () => "/vans/",
      providesTags: ["Vans"],
    }),
  }),
});

export const { useGetVansQuery } = vansApiSlice;

export type VanLocations = Record<number, Coordinate>;

const initialVanLocationState: VanLocations = {};

export const vanLocationSlice = createSlice({
  name: "vanLocation",
  initialState: initialVanLocationState,
  reducers: {
    updateVanLocation(state, action: PayloadAction<RawVanLocations>) {
      for (const vanId in action.payload) {
        state[parseInt(vanId)] = action.payload[parseInt(vanId)];
      }
    },
  },
});

type RawVanLocations = Record<string, Coordinate>;

let socket: WebSocket | null = null;

export const vanLocationMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (socket === null) {
      const ws = new WebSocket(
        "ws://" +
          process.env.EXPO_PUBLIC_API_DOMAIN +
          "/vans/location/subscribe/",
      );

      ws.onmessage = (event) => {
        // Dispatch an action to update the van location when a message is received
        const data = JSON.parse(event.data);
        dispatch(vanLocationSlice.actions.updateVanLocation(data));
      };

      window.onbeforeunload = () => {
        ws?.close();
        socket = null;
      };

      socket = ws;
    }

    return next(action);
  };

export const useVanLocations: () => VanLocations = () =>
  useAppSelector((state) => state.vanLocation);
