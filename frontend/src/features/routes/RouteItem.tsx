import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  type ViewProps,
} from "react-native";

import TextSkeleton from "../../common/components/TextSkeleton";
import Color from "../../common/style/color";
import { useLocation } from "../location/locationSlice";
import {
  closest,
  formatMiles,
  formatSecondsAsMinutes,
  geoDistanceToMiles,
} from "../location/util";
import { useGetStopsQuery, type ExtendedStop } from "../stops/stopsSlice";
import { useGetVansQuery, type VanLocation } from "../vans/vansSlice";

import { type BasicRoute, type ExtendedRoute } from "./routesSlice";

interface RouteItemProps {
  mode: "basic" | "extended";
  route: ExtendedRoute;
  onPress: (route: ExtendedRoute) => void;
}

/**
 * A component that renders a single route item.
 */
export const RouteItem = ({
  mode,
  route,
  onPress,
}: RouteItemProps): React.JSX.Element => {
  const closestStop = useClosestStop(route);
  const routeNameColorStyle = {
    color: Color.orecart.get(route.name) ?? Color.generic.black,
  };

  // TODO: Remove as soon as we fetch colors from backend

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
          {route.isActive ? (
            closestStop !== undefined ? (
              <>
                <Text style={styles.routeStatus}>
                  Next OreCart in{" "}
                  <Text style={styles.routeStatusEmphasis}>
                    {closestStop.vanArrivalTime}
                  </Text>
                </Text>
                {mode === "extended" ? (
                  <Text style={styles.routeContext}>
                    At {closestStop.name} ({closestStop.distanceFromUser})
                  </Text>
                ) : null}
              </>
            ) : (
              <Text style={styles.routeStatus}>Running</Text>
            )
          ) : (
            <Text style={styles.routeStatus}>Not running</Text>
          )}
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

interface ClosestStop extends ExtendedStop {
  distanceFromUser: string;
  vanArrivalTime: string;
}

function useClosestStop(to: BasicRoute): ClosestStop | undefined {
  const vans = useGetVansQuery().data;
  if (vans === undefined) {
    return undefined;
  }

  const stops = useGetStopsQuery().data;
  if (stops === undefined) {
    return undefined;
  }

  const location = useLocation();
  if (location === undefined) {
    return undefined;
  }

  const routeStops = stops.filter((stop) => stop.routeIds.includes(to.id));
  const closestRouteStop = closest(routeStops, location);
  if (closestRouteStop === undefined) {
    return undefined;
  }

  const arrivingVans = vans
    .filter(
      (van) =>
        van.location !== undefined &&
        van.location.nextStopId === closestRouteStop.inner.id,
    )
    .map((van) => van.location) as VanLocation[];
  const closestRouteStopVan = closest(arrivingVans, location);
  if (closestRouteStopVan === undefined) {
    return undefined;
  }

  return {
    ...closestRouteStop.inner,
    distanceFromUser: formatMiles(
      geoDistanceToMiles(closestRouteStop.distance),
    ),
    vanArrivalTime: formatSecondsAsMinutes(
      closestRouteStopVan.inner.secondsToNextStop,
    ),
  };
}

/**
 * A skeleton component that mimics the {@interface RouteItem} component.
 */
export const RouteItemSkeleton = ({ style }: ViewProps): React.JSX.Element => {
  return (
    <View style={[styles.innerContainer, style]}>
      <View style={styles.routeInfoContainer}>
        <TextSkeleton widthFraction={0.4} style={[styles.routeName]} />
        <TextSkeleton widthFraction={0.6} style={[styles.routeStatus]} />
        <TextSkeleton widthFraction={0.5} style={[styles.routeContext]} />
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
  routeContext: {
    fontSize: 12,
  },
});
