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
import Color from "../../common/style/color";
import { formatSecondsAsMinutes } from "../location/util";
import { type Route } from "../routes/routesSlice";

import { useArrivalEstimate } from "./arrivalSlice";
import { type ParentStop } from "./stopsSlice";

interface StopRouteItemProps {
  route: Route;
  stop: ParentStop;
  onPress: (route: Route) => void;
}
/**
 * A component that renders a single route item.
 */
export const StopRouteItem = ({
  route,
  stop,
  onPress,
}: StopRouteItemProps): React.JSX.Element => {
  const routeNameColorStyle = {
    color: route.color,
  };
  const arrivalEstimate = useArrivalEstimate(stop, route);

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
            query={arrivalEstimate}
            body={(arrivalEstimate: number) =>
              `Next OreCart in ${formatSecondsAsMinutes(arrivalEstimate)}`
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
export const StopRouteItemSkeleton = ({
  style,
}: ViewProps): React.JSX.Element => {
  return (
    <View style={[styles.innerContainer, style]}>
      <View style={styles.routeInfoContainer}>
        <TextSkeleton widthFraction={0.4} style={[styles.routeName]} />
        <TextSkeleton widthFraction={0.6} style={[styles.routeStatus]} />
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
    marginVertical: 4,
  },
  routeStatusEmphasis: {
    fontWeight: "bold",
  },
});
