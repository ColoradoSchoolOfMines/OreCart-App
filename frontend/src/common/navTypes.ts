import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type ParamListBase = {
  Home: undefined,
  ADARequest: undefined,
  Alerts: undefined,
  BugReport: undefined,
  Settings: undefined
};

export type MainScreenProps = {
  navigation: NativeStackNavigationProp<ParamListBase, 'Home'>;
  route: RouteProp<ParamListBase, 'Home'>;
};

export type ADARequestScreenProps = {
  navigation: NativeStackNavigationProp<ParamListBase, 'ADARequest'>;
  route: RouteProp<ParamListBase, 'ADARequest'>;
};

export type AlertsScreenProps = {
  navigation: NativeStackNavigationProp<ParamListBase, 'Alerts'>;
  route: RouteProp<ParamListBase, 'Alerts'>;
};

export type BugReportScreenProps = {
  navigation: NativeStackNavigationProp<ParamListBase, 'BugReport'>;
  route: RouteProp<ParamListBase, 'BugReport'>;
};

export type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<ParamListBase, 'Settings'>;
  route: RouteProp<ParamListBase, 'Settings'>;
};
