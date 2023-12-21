import apiSlice from "../../app/apiSlice"

/**
 * A list of alerts, as defined by the backend.
 */
export type Alerts = Alert[]

/**
 * An alert, as defined by the backend.
 */
export interface Alert {
  id: number
  text: string
}

// --- API Definition ---

/**
 * This slice extends the existing API slice with the alert information route.
 * There should be no state to reason about here, it's just configuration.
 */
const alertsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getActiveAlerts: builder.query<Alerts, void>({
      query: () => "/alerts/?active=true",
      providesTags: ["Alerts"],
    }),
  })
})

/**
 * Hook for querying the list of active alerts.
 */
export const { useGetActiveAlertsQuery } = alertsApiSlice
