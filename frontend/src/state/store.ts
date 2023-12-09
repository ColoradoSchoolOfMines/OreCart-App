import { configureStore } from "@reduxjs/toolkit";

import apiSlice from "../api/slice";
import { vanLocationReducer, vanLocationMiddleware } from "../api/vans";

/**
 * The redux store for the app. This is the source of all state in the app. Avoid
 * useEffect in favor of this.
 */
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    vanLocation: vanLocationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(vanLocationMiddleware),
});

/**
 * Typed wrapper for store state. Should be avoided in favor of useAppSelector.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Typed wrapper for dispatch. Should be avoided in favor of useAppDispatch.
 */
export type AppDispatch = typeof store.dispatch;

export default store;
