import apiSlice from "../../app/apiSlice";

// Define the interface for the PickupSpot response
export interface PickupSpot {
  id: number;
  name: string;
}

// Define the interface for the ADARequest request body
export interface ADARequest {
  pickup_spot_id: number;
  pickup_time: number;
  wheelchair: boolean;
}

// Extend the existing API slice with the new endpoints
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
