import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { Text, View } from "react-native";

import { type OuterParamList } from "../../common/navTypes";

export interface ADARequestScreenProps {
  navigation: StackNavigationProp<OuterParamList, "ADARequest">;
  route: RouteProp<OuterParamList, "ADARequest">;
}

export const ADARequestScreen = ({
  route,
  navigation,
}: ADARequestScreenProps): React.JSX.Element => {
  return (
    <View>
      <Text>Hello!</Text>
    </View>
  );
};
