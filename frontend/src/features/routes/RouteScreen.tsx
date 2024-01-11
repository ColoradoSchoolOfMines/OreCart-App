import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { View, Text } from "react-native";

import { type InnerParamList } from "../../common/navTypes";

export interface StopScreenProps {
  navigation: StackNavigationProp<InnerParamList, "Stop">;
  stop: RouteProp<InnerParamList, "Stop">;
}

export const StopScreen = ({
  stop,
  navigation,
}: StopScreenProps): React.JSX.Element => {
  // const { stopId } = stop.params;

  return (
    <View>
      <Text>Hello!</Text>
    </View>
  );
};
