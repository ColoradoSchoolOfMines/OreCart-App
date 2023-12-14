import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { useAppSelector } from "../../common/hooks";

/**
 * Implemenetation of latitude/longitude-based coordinates independent from any particular
 * mapping library.
 */
export interface Coordinate {
  latitude: number;
  longitude: number;
}

/**
 * The status of location updates.
 */
export type LocationStatus = Active | Inactive | NotGranted | Error;

/**
 * Location updates are currently being sent.
 */
export interface Active {
  type: "active";
  location: Coordinate;
}

/**
 * Location updates are not currently being sent.
 */
export interface Inactive {
  type: "inactive";
}

/**
 * The user has not granted location permissions yet.
 */
export interface NotGranted {
  type: "not_granted";
}

/**
 * An error occurred while trying to get location updates.
 */
export interface Error {
  type: "error";
}

interface LocationState {
  status: LocationStatus;
}

const initialState: LocationState = {
  status: { type: "inactive" },
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    updateLocationStatus: (state, action: PayloadAction<LocationStatus>) => {
      state.status = action.payload;
    },
  },
});

/**
 * Hook for querying the current location. Will be undefined if not currently
 * available.
 */
export const useLocation = (): Coordinate | undefined =>
  useAppSelector((state) =>
    state.location.status.type === "active"
      ? state.location.status.location
      : undefined
  );

/**
 * Hook for querying the current location status.
 */
export const useLocationStatus = (): LocationStatus =>
  useAppSelector((state) => state.location.status);

export const { updateLocationStatus } = locationSlice.actions;

export default locationSlice.reducer;
