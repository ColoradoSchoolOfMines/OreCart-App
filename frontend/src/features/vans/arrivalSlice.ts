import {
  createAction,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import Constants from "expo-constants";
import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../common/hooks";
import { error, loading, success, type Query } from "../../common/query";
import { type Route } from "../routes/routesSlice";
import { type Stop } from "../stops/stopsSlice";

export const subscribeArrival =
  createAction<ArrivalSubscription>("arrivals/subscribe");
export const unsubscribeArrival = createAction<ArrivalSubscription>(
  "arrivals/unsubscribe",
);
type StopId = number;
type RouteId = number;
type Handle = number;

interface ArrivalSubscription {
  stopId: number;
  routeId: number;
}

interface SubscribeArrival extends ArrivalSubscription {
  handle: number;
}

type ArrivalSubscribers = Record<Handle, ArrivalSubscription>;
type ArrivalTimes = Record<Handle, Query<number | undefined>>;

interface ArrivalsState {
  subscribers: ArrivalSubscribers;
  times: ArrivalTimes;
}

type ArrivalsResponse = Record<StopId, Record<RouteId, number>>;
type ArrivalResult = ArrivalSuccess | ArrivalsError;

interface ArrivalSuccess {
  type: "arrivals",
  arrivals: ArrivalsResponse,
}

interface ArrivalsError {
  type: "error",
  error: string,
};

const initialState: ArrivalsState = {
  subscribers: {},
  times: {},
};


export const arrivalsSlice = createSlice({
  name: "arrivals",
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  initialState,
  reducers: {
    setSubscribers: (state, action: PayloadAction<SubscribeArrival>) => {
      state.subscribers[action.payload.handle] = action.payload;
      state.times[action.payload.handle] = loading();
    },
    removeSubscribers: (state, action: PayloadAction<number>) => {
      // I have no choice but to use dynamic delete here, Redux hates the Map object.
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete state.subscribers[action.payload];
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete state.times[action.payload];
    },
    setArrivalTimes: (state, action: PayloadAction<ArrivalsResponse>) => {
      for (const handle in state.subscribers) {
        const { stopId, routeId } = state.subscribers[handle];
        state.times[handle] = success(action.payload[stopId]?.[routeId]);
      }
    },
    setArrivalError: (state, action: PayloadAction<string>) => {
      for (const handle in state.subscribers) {
        state.times[handle] = error(action.payload);
      }
    }
  },
});

const { setSubscribers, removeSubscribers, setArrivalTimes, setArrivalError } =
  arrivalsSlice.actions;

const stopArrivalsApiUrl = `${Constants.expoConfig?.extra?.wsApiUrl}/vans/v2/arrivals/subscribe`;

export const manageArrivalEstimates = (): void => {
  const [ws, setWs] = useState<WebSocket | undefined>(undefined);
  const [intervalHandle, setIntervalHandle] = useState<
    NodeJS.Timeout | undefined
  >(undefined);
  const dispatch = useAppDispatch();
  const subscribers = useAppSelector((state) => state.arrivals.subscribers);
  const [stupidCounter, setStupidCounter] = useState<number>(0);

  useEffect(() => {
    if (ws === undefined) {
      const ws = new WebSocket(stopArrivalsApiUrl);
      ws.addEventListener("message", (event) => {
        const result: ArrivalResult = JSON.parse(event.data);
        if (result.type === "arrivals") {
          dispatch(setArrivalTimes(result.arrivals));
        } else {
          dispatch(setArrivalError(result.error));
        }
      });

      ws.addEventListener("open", () => {
        setWs(ws);
      });

      ws.addEventListener("close", () => {
        setWs(undefined);
      });

      ws.addEventListener("error", (e) => {
        setWs(undefined);
        dispatch(setArrivalError("Failed to connect websocket"));
      });

      const handle = setInterval(() => {
        setStupidCounter((i) => i + 1);
      }, 2000);
      setIntervalHandle(handle);
    }
    return () => {
      ws?.close();
      setWs(undefined);
      clearInterval(intervalHandle);
      setIntervalHandle(undefined);
    };
  }, []);

  useEffect(() => {
    const query: Record<number, number[]> = {};
    for (const handle in subscribers) {
      const { stopId, routeId } = subscribers[handle];
      if (query[stopId] === undefined) {
        query[stopId] = [];
      }
      if (query[stopId].includes(routeId)) {
        continue;
      }
      query[stopId].push(routeId);
    }
    ws?.send(JSON.stringify(query));
  }, [ws, subscribers, stupidCounter]);
};

export const useArrivalEstimate = (
  stop: Stop,
  route: Route,
): Query<number | undefined> => {
  const [handle] = useState<number>(Math.random());
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSubscribers({ handle, stopId: stop.id, routeId: route.id }));
    return () => {
      dispatch(removeSubscribers(handle));
    };
  }, [stop, route]);

  return useAppSelector((state) => state.arrivals.times[handle] ?? loading());
};

export const useArrivalEstimateQuery = (
  stop: Query<Stop>,
  route: Route,
): Query<number | undefined> => {
  const [handle] = useState<number>(Math.random());
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!stop.isSuccess) {
      return;
    }
    dispatch(
      setSubscribers({ handle, stopId: stop.data.id, routeId: route.id }),
    );
    return () => {
      dispatch(removeSubscribers(handle));
    };
  }, [stop.data, route]);

  return useAppSelector((state) => state.arrivals.times[handle] ?? loading());
};
