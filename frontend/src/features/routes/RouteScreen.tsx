import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { type InnerParamList } from "../../common/navTypes";
import Color from "../../common/style/color";
import StopList from "../stops/StopList";
import { useGetStopsQuery } from "../stops/stopsSlice";

import { type BasicRoute, useGetRouteQuery } from "./routesSlice";

export interface RouteScreenProps {
  navigation: StackNavigationProp<InnerParamList, "Route">;
  route: RouteProp<InnerParamList, "Route">;
}

export const RouteScreen = ({
  route: navRoute,
  navigation,
}: RouteScreenProps): React.JSX.Element => {
  const { routeId } = navRoute.params;
  const { data: route } = useGetRouteQuery(routeId);
  const { data: stops } = useGetStopsQuery();

  const routeStops = stops?.filter((stop) => stop.routeIds.includes(routeId));

  if (route === undefined) {
    // TODO: Add a loading indicator
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const routeNameColorStyle = { color: Color.orecart.get(route?.name) };

  return (
    <View>
      <View style={styles.container}>
        <Text style={[styles.routeName, routeNameColorStyle]}>
          {route?.name}
        </Text>
        <Text style={styles.routeDesc}>{getDescriptionWorkaround(route)}</Text>
      </View>
      <StopList
        stops={routeStops}
        onPress={(stop) => {
          navigation.push("Stop", { stopId: stop.id });
        }}
      />
    </View>
  );
};

// TODO: REMOVE AS SOON AS POSSIBLE!!!!
const getDescriptionWorkaround = (route: BasicRoute): string | undefined => {
  switch (route.name) {
    case "Tungsten":
      return "Travels between campus and the RTD W Line Stop";

    case "Silver":
      return "Travels between campus and Mines Park";

    case "Gold":
      return "Travels between campus and downtown Golden";

    default:
      return undefined;
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  routeName: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  routeDesc: {
    fontSize: 16,
  },
});
