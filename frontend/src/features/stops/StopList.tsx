import React from "react";
import { FlatList, StyleSheet, View, type ViewProps } from "react-native";

import Divider from "../../common/components/Divider";
import SkeletonList from "../../common/components/SkeletonList";
import LayoutStyle from "../../common/style/layout";
import { useLocation } from "../location/locationSlice";
import { distance } from "../location/util";

import { StopItem, StopItemSkeleton } from "./StopItem";
import { type Stop } from "./stopsSlice";

interface StopListProps extends ViewProps {
  stops?: Stop[];
  /** Called when the stop item is clicked on. */
  onPress: (stop: Stop) => void;
}

/**
 * Screen that displays a list of stops.
 */
const StopList = ({ stops, onPress }: StopListProps): React.JSX.Element => {
  const sortedStops = sortStopsByDistance(stops);
  return (
    <View style={[LayoutStyle.fill]}>
      {sortedStops !== undefined ? (
        <FlatList
          style={styles.stopContainer}
          data={stops}
          renderItem={({ item }) => <StopItem stop={item} onPress={onPress} />}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={Divider}
        />
      ) : (
        <SkeletonList
          style={styles.stopContainer}
          divider={true}
          generator={() => <StopItemSkeleton />}
        />
      )}
    </View>
  );
};

function sortStopsByDistance(stops?: Stop[]): Stop[] | undefined {
  const location = useLocation();
  if (stops === undefined || location === undefined) {
    return undefined;
  }

  return stops.sort((a, b) => {
    const aDistance = distance(location, a);
    const bDistance = distance(location, b);
    return aDistance - bDistance;
  });
}

const styles = StyleSheet.create({
  stopContainer: {
    paddingHorizontal: 8,
  },
  loadingContainer: {
    padding: 16,
  },
  header: {
    textAlign: "center",
    paddingBottom: 16,
  },
});

export default StopList;
