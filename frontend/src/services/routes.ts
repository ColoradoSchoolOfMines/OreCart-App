import { apiGet } from "./api";
import { type Coordinate } from "./location";

export type Routes = Route[];

export interface Route {
  id: string;
  name: string;
  stopIds: number[];
  waypoints: Coordinate[];
  isActive: boolean;
}

export async function getRoutes(): Promise<Routes> {
  return await apiGet<Routes>("/routes/?include=stopIds&include=waypoints&include=isActive");
}
