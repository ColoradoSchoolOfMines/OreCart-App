import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { Text, View } from "react-native";

import { type OuterParamList } from "../../common/navTypes";


export interface BugReportScreenProps {
  navigation: StackNavigationProp<OuterParamList, "BugReport">;
  route: RouteProp<OuterParamList, "BugReport">;
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
