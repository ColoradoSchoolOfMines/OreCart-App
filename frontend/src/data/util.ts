import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";

import type { RootState, AppDispatch } from "./store";

export type AppSelector<T> = (state: RootState) => T;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
