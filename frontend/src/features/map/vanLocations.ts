import Constants from "expo-constants";
import { useEffect, useState } from "react";

import { error, loading, success, type Query } from "../../common/query";
import { type Coordinate } from "../location/locationSlice";
import { type Route } from "../routes/routesSlice";

const vanLocationApiUrl = `${Constants.expoConfig?.extra?.wsApiUrl}/vans/location/subscribe/`;

export interface VanTrackerState {
  subscribers: Record<number, number>;
  locations: VanLocation[];
}

export interface VanLocation extends Coordinate {
  id: number;
  color: string;
}

export const useVanLocations = (routes: Route[]): Query<VanLocation[]> => {
  const [ws, setWs] = useState<WebSocket | undefined>(undefined);
  const [locations, setLocations] = useState<Query<VanLocation[]>>(loading());

  useEffect(() => {
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
      setLocations(error("Failed to connect to van location websocket"));
    });

    return () => {
      ws.close();
      setWs(undefined);
    };
  }, []);

  useEffect(() => {
    ws?.send(JSON.stringify(routes.map((route) => route.id)));
  }, [routes, ws]);

  return locations;
};
