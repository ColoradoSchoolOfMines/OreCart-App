import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  type ViewProps,
  Dimensions,
} from "react-native";

import Color from "../../common/style/color";
import { type Coordinate, useLocation } from "../location/locationSlice";
import { closest, geoDistanceToMiles } from "../location/util";
import { type Stop, useGetStopsQuery } from "../stops/stopsSlice";
import { estimateTime } from "../vans/util";
import { useGetVansQuery } from "../vans/vansSlice";

import { type Route } from "./routesSlice";


/**
 * The props for the {@interface RouteItem} component.
 */
interface RouteItemProps {
  /** The route to display. */
  route: Route;
}

/**
 * A component that renders a single route item.
 */
export const RouteItem: React.FC<RouteItemProps> = ({ route }) => {
  const closestStop = useClosestStop(route);
  const routeNameColorStyle = {
    color: Color.orecart.get(route.name) ?? Color.generic.black,
  };

  // TODO: Remove as soon as we fetch colors from backend

  return (
    <TouchableHighlight
      onPress={() => {}}
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
                    {closestStop.vanArrivalTime} min
                  </Text>
                </Text>
                <Text style={styles.routeContext}>
                  At {closestStop.name} ({closestStop.distanceFromUser} mi)
                </Text>
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

interface ClosestStop extends Stop {
  distanceFromUser: number;
  vanArrivalTime: number;
}

function useClosestStop(to: Route): ClosestStop | undefined {
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

  const routeStops = stops.filter((stop) => to.id in stop.routeIds);
  const closestRouteStop = closest(routeStops, location);
  if (closestRouteStop === undefined) {
    return undefined;
  }

  const vansWithLocation = vans
    .filter((van) => van.location !== undefined)
    .map((van) => van.location) as Coordinate[];
  const closestRouteStopVan = closest(vansWithLocation, closestRouteStop.inner);
  if (closestRouteStopVan === undefined) {
    return undefined;
  }

  return {
    ...closestRouteStop.inner,
    distanceFromUser: Math.round(
      Math.ceil(geoDistanceToMiles(closestRouteStop.distance))
    ),
    vanArrivalTime: Math.round(
      Math.ceil(estimateTime(geoDistanceToMiles(closestRouteStopVan?.distance)))
    ),
  };
}

/**
 * A skeleton component that mimics the {@interface RouteItem} component.
 */
export const RouteItemSkeleton: React.FC<ViewProps> = ({ style }) => {
  const width = Dimensions.get("window").width;

  const routeNameWidthStyle = {
    width: width * 0.4,
  };
  const routeStatusWidthStyle = {
    width: width * 0.6,
  };
  const routeContextWidthStyle = {
    width: width * 0.5,
  };

  return (
    <View style={[styles.innerContainer, style]}>
      {/* We want to make sure the placeholders have the same height as real text elements, so we simply
      add empty text elements set to the same configuration as the normal text elements. By some quirk of
      RN, this results in a text element that takes up the height needed without having to put any
      placeholder text content. */}
      <View style={styles.routeInfoContainer}>
        <Text
          style={[styles.routeName, styles.textSkeleton, routeNameWidthStyle]}
        />
        <Text
          style={[
            styles.routeStatus,
            styles.textSkeleton,
            routeStatusWidthStyle,
          ]}
        />
        <Text
          style={[
            styles.routeContext,
            styles.textSkeleton,
            routeContextWidthStyle,
          ]}
        />
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
  textSkeleton: {
    backgroundColor: Color.generic.skeleton,
    borderRadius: 32,
    color: "transparent",
  },
});
