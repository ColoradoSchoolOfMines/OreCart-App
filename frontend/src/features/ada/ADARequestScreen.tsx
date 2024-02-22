import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { View } from "react-native";

import { useState } from "react";
import { type OuterParamList } from "../../common/navTypes";
import PickupSpotList from "./PickupSpotList";
import { useGetPickupSpotsQuery } from "./adaSlice";

export interface ADARequestScreenProps {
  navigation: StackNavigationProp<OuterParamList, "ADARequest">;
  route: RouteProp<OuterParamList, "ADARequest">;
}

export const ADARequestScreen = ({
  route,
  navigation,
}: ADARequestScreenProps): React.JSX.Element => {
  const { data: pickupSpots } = useGetPickupSpotsQuery();
  const [currentSpotId, setCurrentSpotId] = useState<number | undefined>(null);
  return (
    <View>
      <PickupSpotList
        spots={pickupSpots}
        onSpotSelected={(spot) => {
          setCurrentSpotId(spot?.id);
        }}
      />
    </View>
  );
};
