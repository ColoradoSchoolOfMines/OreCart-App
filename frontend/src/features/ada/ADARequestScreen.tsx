import { type RouteProp } from "@react-navigation/native";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, View } from "react-native";

import { type ParamList } from "../../common/navTypes";

export interface ADARequestScreenProps {
  navigation: NativeStackNavigationProp<ParamList, "ADARequest">;
  route: RouteProp<ParamList, "ADARequest">;
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