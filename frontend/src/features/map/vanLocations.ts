import Constants from "expo-constants";
import { useEffect, useState } from "react";

import { error, loading, success, type Query } from "../../common/query";
import { type Coordinate } from "../location/locationSlice";
import { type Route } from "../routes/routesSlice";

const vanLocationApiUrl = `${Constants.expoConfig?.extra?.wsApiUrl}/vans/v2/subscribe/`;

export interface VanTrackerState {
  subscribers: Record<number, number>;
  locations: VanLocation[];
}

export interface VanLocation {
  guid: number;
  color: string;
  location: Coordinate;
}

interface VanLocationQuery {
  include: string[];
  filter: {
    by: string;
    alive?: boolean;
    routeIds?: number[];
  };
}

export const useVanLocations = (routes?: Route[]): Query<VanLocation[]> => {
  const [ws, setWs] = useState<WebSocket | undefined>(undefined);
  const [intervalHandle, setIntervalHandle] = useState<NodeJS.Timeout | undefined>(undefined);
  const [locations, setLocations] = useState<Query<VanLocation[]>>(loading());
  const [stupidCounter, setStupidCounter] = useState<number>(0);

  function send(routes?: Route[]): void {
    const message: VanLocationQuery = {
      include: ["color", "location"],
      filter: {
        by: "vans",
        alive: true,
        // routeIds: routes?.map((route) => route.id),
      }
    }
    ws?.send(JSON.stringify(message));
  }

  useEffect(() => {
    if (ws === undefined) {     
      const ws = new WebSocket(vanLocationApiUrl);
      ws.addEventListener("message", (event) => {
        setLocations(success(JSON.parse(event.data)));
      });


      ws.addEventListener("open", () => {
        setWs(ws);
      });

      ws.addEventListener("close", () => {
        setWs(undefined);
      });

      ws.addEventListener("error", (e) => {
        setWs(undefined);
        console.log(e);
        setLocations(error("Failed to connect to van location websocket"));
      });

      // For some reason ws.send within a useEffect setInterval call doesn't work,
      // but changing some state that is hooked to another useEffect that then does
      // the send... does. I don't know why. Now you know why it's called stupidCounter.
      const handle = setInterval(() => { setStupidCounter((i) => i + 1) }, 2000)
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
    send(routes);
  }, [routes, ws, stupidCounter]);

  return locations;
};
