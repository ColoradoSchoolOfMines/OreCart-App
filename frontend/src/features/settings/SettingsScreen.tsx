import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { Text, View } from "react-native";

import { type ParamList } from "../../common/navTypes";


export interface SettingsScreenProps {
  navigation: StackNavigationProp<ParamList, "Settings">;
  route: RouteProp<ParamList, "Settings">;
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
