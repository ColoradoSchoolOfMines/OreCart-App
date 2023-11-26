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

import { type Route } from "../services/routes";
import Color from "../style/color";

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
  const routeNameColorStyle = { color: Color.generic.black };

  // TODO: Remove as soon as we fetch colors from backend
  switch (route.name) {
    case "Tungsten":
      routeNameColorStyle.color = Color.orecart.tungsten;
      break;
    case "Silver":
      routeNameColorStyle.color = Color.orecart.silver;
      break;
    case "Gold":
      routeNameColorStyle.color = Color.orecart.gold;
      break;
  }

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
            <>
              <Text style={styles.routeStatus}>
                Next OreCart in{" "}
                <Text style={styles.routeStatusEmphasis}>5 min</Text>
              </Text>
              <Text style={styles.routeContext}>At Jackston Street (1 mi)</Text>
            </>
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

/**
 * A skeleton component that mimics the {@interface RouteItem} component.
 */
export const RouteItemSkeleton: React.FC<ViewProps> = ({ style }) => {
  const routeNameWidthStyle = {
    width: Dimensions.get("window").width * 0.3,
  };
  const routeStatusWidthStyle = {
    width: Dimensions.get("window").width * 0.6,
  };
  const routeContextWidthStyle = {
    width: Dimensions.get("window").width * 0.4,
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
