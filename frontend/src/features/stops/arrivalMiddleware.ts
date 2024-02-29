import { createAction, createListenerMiddleware } from "@reduxjs/toolkit";
import Constants from "expo-constants";

import { type RootState } from "../../app/store";
import { type Route } from "../routes/routesSlice";

import {
  addSubscribers,
  removeSubscribers,
  setArrivalTimes,
} from "./arrivalSlice";
import { type Stop } from "./stopsSlice";

const stopArrivalsApiUrl = `${Constants.expoConfig?.extra?.wsApiUrl}/stop/arrivals/subscribe/`;

type StopId = number;
type RouteId = number;
type ArrivalQuery = Record<StopId, RouteId[]>;

export interface ArrivalSubscription {
  stop: Stop;
  route: Route;
}

export const subscribeArrival =
  createAction<ArrivalSubscription>("arrivals/subscribe");
export const unsubscribeArrival = createAction<ArrivalSubscription>(
  "arrivals/unsubscribe"
);

export const arrivalMiddleware = createListenerMiddleware();

let ws: WebSocket | undefined;

arrivalMiddleware.startListening({
  actionCreator: subscribeArrival,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(addSubscribers(action.payload));
    const state = listenerApi.getState() as RootState;
    const subscribers = state.arrivals.subscribers;
    if (ws !== undefined) {
      ws.send(JSON.stringify(subscribers));
    } else {
      ws = new WebSocket(stopArrivalsApiUrl);
      ws.addEventListener("message", (event) => {
        const times = JSON.parse(event.data);
        listenerApi.dispatch(setArrivalTimes(times));
      });
      ws.addEventListener("open", () => {
        ws?.send(JSON.stringify(subscribers));
      });
      ws.addEventListener("close", () => {
        ws = undefined;
      });
      ws.addEventListener("error", () => {
        ws = undefined;
      });
    }
  },
});

arrivalMiddleware.startListening({
  actionCreator: unsubscribeArrival,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(removeSubscribers(action.payload));
    const state = listenerApi.getState() as RootState;
    const subscribers = state.arrivals.subscribers;
    if (ws !== undefined) {
      const query: ArrivalQuery = {};
      for (const stopId in subscribers) {
        query[stopId] = Object.keys(subscribers[stopId])
          .map(parseInt)
          .filter((routeId) => subscribers[stopId][routeId] > 0);
      }

      if (Object.keys(subscribers).length > 0) {
        ws.send(JSON.stringify(subscribers));
      } else {
        ws.close();
      }
    }
  },
});
