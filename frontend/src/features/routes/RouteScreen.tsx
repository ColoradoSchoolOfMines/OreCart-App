import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import ParentChildList from "../../common/components/ParentChildList";
import TextSkeleton from "../../common/components/TextSkeleton";
import { type InnerParamList } from "../../common/navTypes";
import { wrapReduxQuery } from "../../common/query";
import { changeMapFocus, type MapFocus } from "../map/mapSlice";
import { type Stop } from "../stops/stopsSlice";

import { useGetRouteQuery, type ParentRoute } from "./routesSlice";
import { RouteStopItem, StopItemSkeleton } from "./RouteStopItem";

export interface RouteScreenProps {
  navigation: StackNavigationProp<InnerParamList, "Route">;
  route: RouteProp<InnerParamList, "Route">;
}

export const RouteScreen = ({
  route: navRoute,
  navigation,
}: RouteScreenProps): React.JSX.Element => {
  const route = useGetRouteQuery(navRoute.params.routeId);
  const routeFocus: MapFocus | undefined = route.isSuccess
    ? { type: "SingleRoute", route: route.data }
    : undefined;
  changeMapFocus(routeFocus);

  return (
    <ParentChildList
      style={styles.listContainer}
      header={(route: ParentRoute) => <RouteHeader route={route} />}
      headerSkeleton={() => <RouteSkeleton />}
      item={(route: ParentRoute, stop: Stop) => (
        <RouteStopItem
          route={route}
          stop={stop}
          onPress={(stop: Stop) => {
            navigation.push("Stop", { stopId: stop.id });
          }}
        />
      )}
      itemSkeleton={() => <StopItemSkeleton />}
      divider="line"
      query={wrapReduxQuery<ParentRoute>(route)}
      refresh={route.refetch}
      map={(route: ParentRoute) => route.stops}
      keyExtractor={(stop: Stop) => stop.id.toString()}
      bottomSheet={true}
      errorMessage="Failed to load route. Please try again."
    />
  );
};

const RouteHeader = ({ route }: { route: ParentRoute }): React.JSX.Element => {
  const routeNameColorStyle = { color: route.color };

  return (
    <View style={styles.headerContainer}>
      <Text style={[styles.routeName, routeNameColorStyle]}>{route?.name}</Text>
      <Text style={styles.routeDesc}>{route.description}</Text>
    </View>
  );
};

const RouteSkeleton = (): React.JSX.Element => {
  return (
    <View style={styles.headerContainer}>
      <TextSkeleton style={styles.routeName} widthFraction={0.4} />
      <TextSkeleton style={styles.routeDesc} widthFraction={0.6} />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 8,
  },
  headerContainer: {
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
  message: {
    marginVertical: 16,
  },
});
