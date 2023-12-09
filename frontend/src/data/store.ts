import { configureStore } from "@reduxjs/toolkit";

import apiSlice from "../api/apiSlice";
import { vanLocationSlice, vanLocationMiddleware } from "../api/vans";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    vanLocation: vanLocationSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(vanLocationMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
