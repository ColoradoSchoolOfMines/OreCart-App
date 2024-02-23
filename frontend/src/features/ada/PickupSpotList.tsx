import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { type ViewProps } from "react-native-svg/lib/typescript/fabric/utils";

import SkeletonList from "../../common/components/SkeletonList";

import { type PickupSpot } from "./adaSlice";
import { PickupSpotItem, PickupSpotItemSkeleton } from "./PickupSpotItem";

/**
 * The props for the {@interface PickupSpotList} component.
 * @property spots - The list of pickup spots to render. Should be undefined if loading.
 * @property onSpotSelected - A callback to call when a spot is selected.
 * Called with null if the spot is deselected.
 */
interface PickupSpotListProps extends ViewProps {
  spots?: PickupSpot[];
  onSpotSelected: (spot: PickupSpot | null) => void;
}

/**
 * A list of pickup spots as shown by {@function PickupSpotItem}.
 */
const PickupSpotList = ({
  spots,
  onSpotSelected,
  style,
}: PickupSpotListProps): React.JSX.Element => {
  const [selectedSpot, setSelectedSpot] = useState<PickupSpot | null>(null);

  const handleSpotSelected = (spot: PickupSpot): void => {
    if (selectedSpot === spot) {
      // Deselect the spot if it's already selected
      setSelectedSpot(null);
      onSpotSelected(null);
      return;
    }
    // Select the spot and propagate the selection
    setSelectedSpot(spot);
    onSpotSelected(spot);
  };

  return spots !== undefined ? (
    <View style={[styles.container, style]}>
      {spots.map((spot) => (
        <PickupSpotItem
          key={spot.id}
          spot={spot}
          selected={selectedSpot === spot}
          onPress={handleSpotSelected}
        />
      ))}
    </View>
  ) : (
    // Nothing loaded, show skeleton items but horizontally.
    <SkeletonList
      generator={() => <PickupSpotItemSkeleton />}
      divider={false}
      style={[styles.container, style]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});

export default PickupSpotList;
