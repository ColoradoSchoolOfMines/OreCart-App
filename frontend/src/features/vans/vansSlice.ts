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
  location?: Coordinate;
}

// --- API Definition ---

type VanLocations = Record<string, Coordinate>;

const vanLocationApiUrl =
  "ws://" + process.env.EXPO_PUBLIC_API_DOMAIN + "/vans/location/subscribe/";

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
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        // By coupling location tracking with the cached vans fetch results,
        // we can not only collate van information with location information,
        // but also ensure that the websocket is closed when the cache entry
        // is removed.
        const ws = new WebSocket(vanLocationApiUrl);

        try {
          await cacheDataLoaded;

          const locationListener = (event: MessageEvent): void => {
            const locations: VanLocations = JSON.parse(event.data);
            updateCachedData((vans) => {
              for (const vanId in locations) {
                // Need to convert from the stringed JSON IDs to numbered ones.
                const id = parseInt(vanId);
                vans[id].location = locations[vanId];
              }
            });
          };

          ws.addEventListener("message", locationListener);
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }

        await cacheEntryRemoved;
        ws.close();
      },
      providesTags: ["Vans"],
    }),
  }),
});

/**
 * Hook for querying the list of vans.
 */
export const { useGetVansQuery } = vansApiSlice;
