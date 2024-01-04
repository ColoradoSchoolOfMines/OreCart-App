import { type RouteProp } from "@react-navigation/native";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, View } from "react-native";

import { type ParamList } from "../../common/navTypes";


export interface BugReportScreenProps {
  navigation: NativeStackNavigationProp<ParamList, "BugReport">;
  route: RouteProp<ParamList, "BugReport">;
}

export const BugReportScreen = ({
  route,
  navigation,
}: BugReportScreenProps): React.JSX.Element => {
  return (
    <View>
      <Text>Hello!</Text>
    </View>
  );
};
