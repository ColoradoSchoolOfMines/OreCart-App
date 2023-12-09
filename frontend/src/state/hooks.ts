import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";

import type { RootState, AppDispatch } from "./store";

/**
 * Typed wrapper around useDispatch. This prevents you from having to specify
 * the argument type repeatedly as with regular useDispatch. Should not be used
 * outside of slice definitions.
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Typed wrapper around useSelector. This prevents you from having to specify
 * the argument type repeatedly as with regular useDispatch. Should not be used
 * outside of slice definitions.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
