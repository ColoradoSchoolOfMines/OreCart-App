import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { type OuterParamList } from "../../common/navTypes";

import { useGetPickupSpotsQuery, type PickupSpot } from "./adaSlice";
import PickupSpotList from "./PickupSpotList";

export interface ADARequestScreenProps {
  navigation: StackNavigationProp<OuterParamList, "ADARequest">;
  route: RouteProp<OuterParamList, "ADARequest">;
}

export const ADARequestScreen = ({
  route,
  navigation,
}: ADARequestScreenProps): React.JSX.Element => {
  const { data: pickupSpots } = useGetPickupSpotsQuery();
  const [currentSpot, setCurrentSpot] = useState<PickupSpot | null>(null);
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a pickup spot</Text>
      <PickupSpotList
        style={styles.innerContainer}
        spots={pickupSpots}
        onSpotSelected={(spot) => {
          setCurrentSpot(spot);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  innerContainer: {
    paddingVertical: 8,
  },
});
