import { type ParamListBase } from "@react-navigation/core";

export interface OuterParamList extends ParamListBase {
  Home: undefined;
  ADARequest: undefined;
  Alerts: undefined;
  BugReport: undefined;
  Settings: undefined;
}

export interface InnerParamList extends ParamListBase {
  Landing: undefined;
  Route: { routeId: number };
  Stop: { stopId: number };
}