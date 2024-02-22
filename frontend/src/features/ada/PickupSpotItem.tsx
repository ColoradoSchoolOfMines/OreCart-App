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
import { PickupSpot } from "./adaSlice";

interface PickupSpotItemProps {
  spot: PickupSpot;
  selected: boolean;
  onPress: (spot: PickupSpot) => void;
}

/**
 * A component that renders a single route item.
 */
export const PickupSpotItem = ({
  spot,
  selected,
  onPress,
}: PickupSpotItemProps): React.JSX.Element => {
  return (
    <TouchableHighlight
      onPress={() => {
        onPress(spot);
      }}
      underlayColor={Color.csm.primary.ext.blaster_blue_highlight}
      style={styles.touchableContainer}
    >
      <View
        style={[
          styles.innerContainerBase,
          selected ? styles.innerContainerSelected : styles.innerContainer,
        ]}
      >
        {selected ? (
          <MaterialIcons name="check" size={24} color={Color.generic.white} />
        ) : null}
        <Text
          style={
            selected
              ? [styles.spotName, styles.spotNameSelected]
              : styles.spotName
          }
        >
          {spot.name}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

/**
 * A skeleton component that mimics the {@interface PickupSpotItemSkeleton} component.
 */
export const PickupSpotItemSkeleton = ({
  style,
}: ViewProps): React.JSX.Element => {
  return (
    <View
      style={[styles.innerContainerBase, styles.innerContainerSkeleton, style]}
    >
      <TextSkeleton style={styles.spotName} widthFraction={0.2} />
    </View>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    borderRadius: 100,
  },
  innerContainerBase: {
    borderRadius: 100,
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    height: 48,
  },
  innerContainer: {
    backgroundColor: Color.csm.primary.pale_blue,
  },
  innerContainerSelected: {
    backgroundColor: Color.csm.primary.light_blue,
  },
  innerContainerSkeleton: {
    backgroundColor: Color.generic.selection,
  },
  spotName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  spotNameSelected: {
    color: Color.generic.white,
  },
});
