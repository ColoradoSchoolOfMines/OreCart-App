import { createListenerMiddleware, createAction } from "@reduxjs/toolkit";
import * as Location from "expo-location";
import { useEffect } from "react";

import { useAppDispatch } from "../../common/hooks";

import { updateLocationStatus } from "./locationSlice";

const locationMiddleware = createListenerMiddleware();
const subscribeLocation = createAction<undefined>("location/start");
const unsubscribeLocation = createAction<undefined>("location/stop");

// This seems to be the only accuracy that's at least somewhat reliable for our purposes. Takes a few seconds
// to initialize and then updates every second or so.
const ACCURACY = Location.Accuracy.BestForNavigation;

let locationSubscription: Location.LocationSubscription | null = null;

// The subscribeLocation action signifies to set up 

locationMiddleware.startListening({
  actionCreator: subscribeLocation,
  effect: async (_, listenerApi) => {
    if (locationSubscription !== null) {
      // Nothing to do
      return;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      // Permission was not granted, we can't do anything.
      listenerApi.dispatch(updateLocationStatus({ type: "not_granted" }));
      return;
    }
    try {
      // Have to track the current subscription so we can unsubscribe later.
      locationSubscription = await Location.watchPositionAsync(
        { accuracy: ACCURACY },
        (newLocation) => {
          // Forward updates to the companion slice so that components can
          // use the current state.
          listenerApi.dispatch(
            updateLocationStatus({
              type: "active",
              location: newLocation.coords,
            })
          );
        }
      );
    } catch (e) {
      listenerApi.dispatch(updateLocationStatus({ type: "error" }));
    }
  },
});

locationMiddleware.startListening({
  actionCreator: unsubscribeLocation,
  effect: async (_, listenerApi) => {
    if (locationSubscription === null) {
      // Nothing to do
      return;
    }

    locationSubscription.remove();
    locationSubscription = null;
    listenerApi.dispatch(updateLocationStatus({ type: "inactive" }));
  },
});

export default locationMiddleware;

/**
 * Convienence function to automatically manage the location middleware. This should be called
 * in the highest level component that still has access to the redux store. 
 */
export function manageLocationMiddleware(): void {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(subscribeLocation());

    return () => {
      dispatch(unsubscribeLocation());
    };
  }, []);
}
