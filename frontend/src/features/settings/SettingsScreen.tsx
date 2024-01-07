import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { Text, View } from "react-native";

import { type OuterParamList } from "../../common/navTypes";

export interface SettingsScreenProps {
  navigation: StackNavigationProp<OuterParamList, "Settings">;
  route: RouteProp<OuterParamList, "Settings">;
}

export const SettingsScreen = ({
  route,
  navigation,
}: SettingsScreenProps): React.JSX.Element => {
  return (
    <View>
      <Text>Hello!</Text>
    </View>
  );
};
