import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import SkeletonList from "../../common/components/SkeletonList";
import { PickupSpotItem, PickupSpotItemSkeleton } from "./PickupSpotItem";
import { PickupSpot } from "./adaSlice";

interface PickupSpotListProps {
  spots?: PickupSpot[];
  onSpotSelected: (spot: PickupSpot | null) => void;
}

const PickupSpotList: React.FC<PickupSpotListProps> = ({
  spots,
  onSpotSelected,
}) => {
  const [selectedSpot, setSelectedSpot] = useState<PickupSpot | null>(null);

  const handleSpotSelected = (spot: PickupSpot) => {
    if (selectedSpot === spot) {
      setSelectedSpot(null);
      onSpotSelected(null);
      return;
    }
    setSelectedSpot(spot);
    onSpotSelected(spot);
  };

  return spots !== undefined ? (
    <View style={styles.container}>
      {spots.map((spot, index) => (
        <PickupSpotItem
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
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 8,
  },
});

export default PickupSpotList;
