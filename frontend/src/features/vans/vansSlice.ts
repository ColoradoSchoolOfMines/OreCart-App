import Constants from "expo-constants";

import apiSlice from "../../app/apiSlice";
import { type Coordinate } from "../location/locationSlice";

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
  location?: VanLocation;
}

// --- API Definition ---

type VanLocations = Record<string, VanLocation>;

export interface VanLocation extends Coordinate {
  nextStopId: number;
  secondsToNextStop: number;
}

const vanLocationApiUrl = `${Constants.expoConfig?.extra?.wsApiUrl}/vans/location/subscribe/`;

/**
 * This slice extends the existing API slice with the van route and companion
 * location websocket connection. There is no state to reason about here regarding
 * the route, it's just configuration. However, we do need to manage the websocket as
 * a side effect of the van route being fetched/cached/removed.
 */
const vansApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getVans: builder.query<Vans, void>({
      query: () => "/vans/",
      async onCacheEntryAdded(
        _,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        // By coupling location tracking with the cached vans fetch results,
        // we can not only collate van information with location information,
        // but also ensure that the websocket is closed when the cache entry
        // is removed.
        const ws = new WebSocket(vanLocationApiUrl);

        const locationListener = (event: MessageEvent): void => {
          const locations: VanLocations = JSON.parse(event.data);
          updateCachedData((vans) => {
            for (const vanId in locations) {
              // Need to convert from the stringed JSON IDs to numbered ones.
              const id = parseInt(vanId, 10);
              if (id in vans) {
                vans[id].location = locations[vanId];
              }
            }
          });
        };

        const errorListener = (event: Event): void => {
          console.error("Unable to track van location", event);
        };

        try {
          await cacheDataLoaded;
          ws.addEventListener("message", locationListener);
          ws.addEventListener("error", errorListener);
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
          console.error(
            "Cache entry removed before cache data loaded, ignoring"
          );
        }

        await cacheEntryRemoved;
        ws.close();
        ws.removeEventListener("message", locationListener);
        ws.removeEventListener("error", errorListener);
      },
      providesTags: ["Vans"],
    }),
  }),
});

/**
 * Hook for querying the list of vans.
 */
export const { useGetVansQuery } = vansApiSlice;
