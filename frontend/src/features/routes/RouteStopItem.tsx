import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  TouchableHighlight,
  View,
  type ViewProps,
} from "react-native";

import QueryText from "../../common/components/QueryText";
import TextSkeleton from "../../common/components/TextSkeleton";
import Color from "../../common/style/color";
import { useDistance } from "../location/locationSlice";
import { formatMiles, formatSecondsAsMinutes } from "../location/util";
import { useArrivalEstimate } from "../stops/arrivalSlice";
import { type Stop } from "../stops/stopsSlice";

import { type ParentRoute } from "./routesSlice";

/**
 * The props for the {@interface StopItem} component.
 */
interface RouteStopItemProps {
  /** The stop to display. */
  stop: Stop;
  route: ParentRoute;
  /** Called when the stop item is clicked on. */
  onPress: (stop: Stop) => void;
}

/**
 * A component that renders a single stop item.
 */
export const RouteStopItem = ({
  stop,
  route,
  onPress,
}: RouteStopItemProps): React.JSX.Element => {
  const distance = useDistance(stop);
  const arrivalEstimate = useArrivalEstimate(stop, route);

  return (
    <TouchableHighlight
      onPress={() => {
        onPress(stop);
      }}
      underlayColor={Color.generic.selection}
      style={styles.touchableContainer}
    >
      <View style={styles.innerContainer}>
        <View style={styles.stopInfoContainer}>
          <QueryText
            style={styles.stopStatus}
            query={arrivalEstimate}
            body={(arrivalEstimate: number) =>
              `Next OreCart in ${formatSecondsAsMinutes(arrivalEstimate)}`
            }
            skeletonWidth={0.6}
            error={stop.isActive ? "Running" : "Not running"}
          />
          <QueryText
            style={styles.stopStatus}
            query={distance}
            body={(distance: number) => `${formatMiles(distance)} away`}
            skeletonWidth={0.6}
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
 * A skeleton component that mimics the {@interface StopItem} component.
 */
export const StopItemSkeleton = ({ style }: ViewProps): React.JSX.Element => {
  return (
    <View style={[styles.innerContainer, style]}>
      <View style={styles.stopInfoContainer}>
        <TextSkeleton widthFraction={0.4} style={[styles.stopName]} />
        <TextSkeleton widthFraction={0.5} style={[styles.stopStatus]} />
        <TextSkeleton widthFraction={0.6} style={[styles.stopStatus]} />
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
  stopInfoContainer: {
    flex: 1,
  },
  stopName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  stopStatus: {
    marginBottom: 4,
  },
  stopStatusEmphasis: {
    fontWeight: "bold",
  },
});
