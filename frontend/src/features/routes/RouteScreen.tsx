import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { View, Text } from "react-native";

import { type InnerParamList } from "../../common/navTypes";

import { useGetRouteQuery } from "./routesSlice";

export interface RouteScreenProps {
  navigation: StackNavigationProp<InnerParamList, "Route">;
  route: RouteProp<InnerParamList, "Route">;
}

export const RouteScreen = ({
  route,
  navigation,
}: RouteScreenProps): React.JSX.Element => {

  return (
    <View>
      {/*  */}
    </View>
  )
}