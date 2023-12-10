import { type Coordinate } from "../services/location";

import apiSlice from "./slice";

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

const vansApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getVans: builder.query<Vans, void>({
      query: () => "/vans/",
      async onCacheEntryAdded(
        _,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const ws = new WebSocket(vanLocationApiUrl);

        try {
          await cacheDataLoaded;

          const locationListener = (event: MessageEvent): void => {
            // New location payload, send it to the companion reducer.
            const locations: VanLocations = JSON.parse(event.data);
            updateCachedData((vans) => {
              for (const vanId in locations) {
                // Need to convert from the stringed JSON IDs to numbered ones.
                const id = parseInt(vanId);
                vans[id] = {
                  ...vans[id],
                  location: locations[vanId],
                };
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
