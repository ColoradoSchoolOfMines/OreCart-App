import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { useFocusEffect } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../common/hooks";
import { ParentRoute } from "../routes/routesSlice";
import { ParentStop } from "../stops/stopsSlice";

export type MapFocus = None | SingleRoute | SingleStop;

export interface None {
  type: "None";
}

export interface SingleRoute {
  type: "SingleRoute";
  route: ParentRoute;
}

export interface SingleStop {
  type: "SingleStop";
  stop: ParentStop;
}

export interface MapState {
  focus: MapFocus;
}

const initialState: MapState = {
  focus: { type: "None" },
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    focusMap: (state, action: PayloadAction<MapFocus>) => {
      state.focus = action.payload;
    },
  },
});

export const { focusMap } = mapSlice.actions;

export const changeMapFocus = (focus?: MapFocus): void => {
  const dispatch = useAppDispatch();
  useFocusEffect(() => {
    if (focus !== undefined) {
      dispatch(focusMap(focus));
    }
  });
};

export const useMapFocus = (): MapFocus => {
  return useAppSelector((state) => state.map.focus);
};
