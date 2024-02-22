import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { type ViewProps } from "react-native-svg/lib/typescript/fabric/utils";

import SkeletonList from "../../common/components/SkeletonList";

import { type PickupSpot } from "./adaSlice";
import { PickupSpotItem, PickupSpotItemSkeleton } from "./PickupSpotItem";

interface PickupSpotListProps extends ViewProps {
  spots?: PickupSpot[];
  onSpotSelected: (spot: PickupSpot | null) => void;
}

const PickupSpotList = ({
  spots,
  onSpotSelected,
  style,
}: PickupSpotListProps): React.JSX.Element => {
  const [selectedSpot, setSelectedSpot] = useState<PickupSpot | null>(null);

  const handleSpotSelected = (spot: PickupSpot): void => {
    if (selectedSpot === spot) {
      setSelectedSpot(null);
      onSpotSelected(null);
      return;
    }
    setSelectedSpot(spot);
    onSpotSelected(spot);
  };

  return spots !== undefined ? (
    <View style={[styles.container, style]}>
      {spots.map((spot, index) => (
        <PickupSpotItem
          key={spot.id}
          spot={spot}
          selected={selectedSpot === spot}
          onPress={handleSpotSelected}
        />
      ))}
    </View>
  ) : (
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
