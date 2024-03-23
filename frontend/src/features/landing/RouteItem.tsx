import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  type ViewProps,
} from "react-native";

import QueryText from "../../common/components/QueryText";
import TextSkeleton from "../../common/components/TextSkeleton";
import { mapQuery, type Query } from "../../common/query";
import Color from "../../common/style/color";
import { useClosest, type Closest } from "../location/locationSlice";
import {
  formatMiles,
  formatSecondsAsMinutes,
  geoDistanceToMiles,
} from "../location/util";
import { type ParentRoute } from "../routes/routesSlice";
import { useArrivalEstimateQuery } from "../stops/arrivalSlice";
import { type Stop } from "../stops/stopsSlice";

interface RouteItemProps {
  route: ParentRoute;
  onPress: (route: ParentRoute) => void;
}
/**
 * A component that renders a single route item.
 */
export const RouteItem = ({
  route,
  onPress,
}: RouteItemProps): React.JSX.Element => {
  const routeNameColorStyle = {
    color: route.color,
  };
  const closestStop: Query<Closest<Stop>> = useClosest(route.stops);
  const stop = mapQuery(closestStop, (closestStop) => closestStop.value);
  const arrivalEstimate: Query<number | undefined> = useArrivalEstimateQuery(
    stop,
    route
  );

  return (
    <TouchableHighlight
      onPress={() => {
        onPress(route);
      }}
      underlayColor={Color.generic.selection}
      style={styles.touchableContainer}
    >
      <View style={styles.innerContainer}>
        <View style={styles.routeInfoContainer}>
          <Text style={[styles.routeName, routeNameColorStyle]}>
            {route.name}
          </Text>
          <QueryText
            style={styles.routeStatus}
            query={closestStop}
            body={(closestStop: Closest<Stop>) =>
              `Closest stop at ${closestStop.value.name} (${formatMiles(
                geoDistanceToMiles(closestStop.distance)
              )} away)`
            }
            skeletonWidth={0.5}
          />
          <QueryText
            style={styles.routeStatus}
            query={arrivalEstimate}
            body={(arrivalEstimate: number | undefined) =>
              arrivalEstimate !== undefined
                ? `Next OreCart in ${formatSecondsAsMinutes(arrivalEstimate)}`
                : route.isActive
                  ? "Running"
                  : "Not running"
            }
            skeletonWidth={0.6}
            error={route.isActive ? "Running" : "Not running"}
          />
        </View>
        <MaterialIcons
          name="arrow-forward"
          size={24}
          color={Color.generic.black}
        />
      </View>
    </TouchableHighlight>
  );
};

/**
 * A skeleton component that mimics the {@interface RouteItem} component.
 */
export const RouteItemSkeleton = ({ style }: ViewProps): React.JSX.Element => {
  return (
    <View style={[styles.innerContainer, style]}>
      <View style={styles.routeInfoContainer}>
        <TextSkeleton widthFraction={0.4} style={styles.routeName} />
        <TextSkeleton widthFraction={0.6} style={styles.routeStatus} />
        <TextSkeleton widthFraction={0.5} style={styles.routeStatus} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    borderRadius: 16,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  routeInfoContainer: {
    flex: 1,
  },
  routeName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  routeStatus: {
    marginTop: 4,
  },
  routeStatusEmphasis: {
    fontWeight: "bold",
  },
});
