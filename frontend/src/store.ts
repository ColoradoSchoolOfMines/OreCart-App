import { configureStore } from "@reduxjs/toolkit";

import apiSlice from "./api/slice";

/**
 * The redux store for the app. This is the source of all state in the app. Avoid
 * useEffect in favor of this.
 */
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
});

/**
 * Typed wrapper for store state. Should be avoided in favor of useAppSelector.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Typed wrapper for dispatch. Should be avoided in favor of useAppDispatch.
 */
export type AppDispatch = typeof store.dispatch;

// These are currently unused, but if you need to drop from RTK to plain redux,
// you'll need these since they're properly typed.
// export const useAppDispatch: () => AppDispatch = useDispatch;
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
