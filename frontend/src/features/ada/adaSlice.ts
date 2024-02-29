import apiSlice from "../../app/apiSlice";

/**
 * A pickup spot as defined in the ADA system. These are distinct from stops.
 * @param id The ID of the pickup spot.
 * @param name The name of the pickup spot.
 */
export interface PickupSpot {
  id: number;
  name: string;
}

/**
 * An ADARequest to be sent to the backend.
 * @param pickup_spot_id The ID of the pickup spot to request a pickup from.
 * @param pickup_time The time to request the pickup at.
 * @param wheelchair Whether the user requires a wheelchair.
 */
export interface ADARequest {
  pickup_spot_id: number;
  pickup_time: number;
  wheelchair: boolean;
}

/**
 * This slice extends the existing API slice with the route information route.
 * There should be no state to reason about here, it's just configuration.
 */
const adaApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getPickupSpots: builder.query<PickupSpot[], void>({
      query: () => "/ada/pickup_spots",
      providesTags: ["PickupSpots"],
    }),
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    postADARequest: builder.mutation<void, ADARequest>({
      query: (request) => ({
        url: "/ada/requests",
        method: "POST",
        body: request,
      }),
    }),
  }),
});

// Export the hooks for the new endpoints
export const { useGetPickupSpotsQuery, usePostADARequestMutation } =
  adaApiSlice;
