import {
  createSlice,
  type Middleware,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { type Coordinate } from "../services/location";
import { useAppSelector } from "../state/hooks";

import apiSlice from "./slice";

/**
 * A list of vans, as defined by the backend.
 */
export type Vans = Van[];

/**
 * A van, as defined by the backend.
 */
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

/**
 * Hook for querying the list of vans.
 */
export const { useGetVansQuery } = vansApiSlice;

/**
 * Maps van IDs to their current location.
 */
export type VanLocations = Record<number, Coordinate>;

const initialVanLocationState: VanLocations = {};
const vanLocationSlice = createSlice({
  name: "vanLocation",
  initialState: initialVanLocationState,
  reducers: {
    updateVanLocation(state, action: PayloadAction<RawVanLocations>) {
      for (const vanId in action.payload) {
        // Need to convert from the stringed JSON IDs to numbers.
        state[parseInt(vanId)] = action.payload[vanId];
      }
    },
  },
});

/**
 * Reducer tracking the current van location from the companion middleware.
 * Shouldn't be used anywhere except for the store definition.
 */
export const vanLocationReducer = vanLocationSlice.reducer;

type RawVanLocations = Record<string, Coordinate>;

let activeSocket = false;

/**
 * Middleware that maintains a background websocket subscription to van location
 * updates and forwards it to the companion van location reducer.
 */
export const vanLocationMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    // Whenever something changes, check if the websocket is closed. This implies
    // either that the app is starting for the first time or if the app has been
    // closed prior. If it is, open a new one. This isn't the cleanest application
    // of middleware, but it's generally more ideal compared to useEffect given
    // that it has to be shared across the whole application.
    if (!activeSocket) {
      const ws = new WebSocket(
        "ws://" +
          process.env.EXPO_PUBLIC_API_DOMAIN +
          "/vans/location/subscribe/",
      );

      ws.onmessage = (event) => {
        // New location payload, send it to the companion reducer.
        const locations = JSON.parse(event.data);
        dispatch(vanLocationSlice.actions.updateVanLocation(locations));
      };

      // Close the WebSocket if the user closes the app. This doesn't include switching
      // to other apps, which may be a problem.
      window.onbeforeunload = () => {
        ws.close();
        activeSocket = false;
      };

      activeSocket = true;
    }

    return next(action);
  };

/**
 * Hook for the current locations of all vans.
 */
export const useVanLocations: () => VanLocations = () =>
  useAppSelector((state) => state.vanLocation);
