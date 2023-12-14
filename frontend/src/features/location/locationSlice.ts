import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { useAppSelector } from "../../common/hooks";

/**
 * Implementation of latitude/longitude-based coordinates independent from any particular
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

/*
 * This slice holds the current location status. Unlike the other RTK Query
 * slices, this has internal state that we must work with. You can think of
 * it as just a dumb holder of the current location. Everything else is managed
 * by the "companion" middleware that is in the other file in this package.
 * That does most of the work on tracking the location, and then just updates
 * the state value in this.
 */
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
