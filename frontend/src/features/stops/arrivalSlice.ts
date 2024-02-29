import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../common/hooks";
import { deepMapQuery, loading, success, type Query } from "../../common/query";
import { type Route } from "../routes/routesSlice";
import { type Stop } from "../stops/stopsSlice";

import {
  subscribeArrival,
  unsubscribeArrival,
  type ArrivalSubscription,
} from "./arrivalMiddleware";

type StopId = number;
type RouteId = number;
type ArrivalSubscribers = Record<StopId, Record<RouteId, number>>;
type ArrivalTimes = Record<StopId, Record<RouteId, number>>;

interface ArrivalsState {
  subscribers: ArrivalSubscribers;
  times: ArrivalTimes;
}

const initialState: ArrivalsState = {
  subscribers: {},
  times: {},
};

export const arrivalsSlice = createSlice({
  name: "arrivals",
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  initialState,
  reducers: {
    addSubscribers: (state, action: PayloadAction<ArrivalSubscription>) => {
      const { stop, route } = action.payload;
      if (state.subscribers[stop.id] === undefined) {
        state.subscribers[stop.id] = {};
      }
      if (state.subscribers[stop.id][route.id] === undefined) {
        state.subscribers[stop.id][route.id] = 0;
      }
      state.subscribers[stop.id][route.id]++;
    },
    removeSubscribers: (state, action: PayloadAction<ArrivalSubscription>) => {
      const { stop, route } = action.payload;
      if (state.subscribers[stop.id] !== undefined) {
        if (state.subscribers[stop.id][route.id] !== undefined) {
          state.subscribers[stop.id][route.id]--;
        }
      }
    },
    setArrivalTimes: (state, action: PayloadAction<ArrivalTimes>) => {
      state.times = action.payload;
    },
  },
});

export const { addSubscribers, removeSubscribers, setArrivalTimes } =
  arrivalsSlice.actions;

export const useArrivalEstimate = (stop: Stop, route: Route): Query<number> => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(subscribeArrival({ stop, route }));
    return () => {
      dispatch(unsubscribeArrival({ stop, route }));
    };
  }, [stop]);

  return useAppSelector((state) => {
    const entry = state.arrivals.times[stop.id];
    if (entry !== undefined) {
      const seconds = entry[route.id];
      if (seconds !== undefined) {
        return success(seconds);
      }
    }
    return loading();
  });
};

export const useArrivalEstimateQuery = (
  stop: Query<Stop>,
  route: Route
): Query<number> => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (stop.isSuccess) {
      dispatch(subscribeArrival({ stop: stop.data, route }));
      return () => {
        dispatch(unsubscribeArrival({ stop: stop.data, route }));
      };
    }
  }, [stop]);

  return useAppSelector((state) =>
    deepMapQuery(stop, (stop) => {
      const entry = state.arrivals.times[stop.id];
      if (entry !== undefined) {
        const seconds = entry[route.id];
        if (seconds !== undefined) {
          return success(seconds);
        }
      }
      return loading();
    })
  );
};
