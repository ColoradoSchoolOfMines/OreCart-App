import { type RouteProp } from "@react-navigation/native";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";

export interface ParamListBase {
  Home: undefined,
  ADARequest: undefined,
  Alerts: undefined,
  BugReport: undefined,
  Settings: undefined
}

export interface MainScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase, 'Home'>;
  route: RouteProp<ParamListBase, 'Home'>;
}

export interface ADARequestScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase, 'ADARequest'>;
  route: RouteProp<ParamListBase, 'ADARequest'>;
}

export interface AlertsScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase, 'Alerts'>;
  route: RouteProp<ParamListBase, 'Alerts'>;
}

export interface BugReportScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase, 'BugReport'>;
  route: RouteProp<ParamListBase, 'BugReport'>;
}

export interface SettingsScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase, 'Settings'>;
  route: RouteProp<ParamListBase, 'Settings'>;
}
