import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { Text, View } from "react-native";

import { type ParamList } from "../../common/navTypes";

export interface AlertsScreenProps {
  navigation: StackNavigationProp<ParamList, "Alerts">;
  route: RouteProp<ParamList, "Alerts">;
}

export const AlertScreen = ({
  route,
  navigation,
}: AlertsScreenProps): React.JSX.Element => {
  return (
    <View>
      <Text>Hello!</Text>
    </View>
  );
};
