import { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View, type ViewProps } from "react-native";

import Divider from "../../common/components/Divider";
import SkeletonList from "../../common/components/SkeletonList";
import LayoutStyle from "../../common/style/layout";
import { useLocation } from "../location/locationSlice";
import { distance } from "../location/util";
import { type BasicRoute } from "../routes/routesSlice";

import { StopItem, StopItemSkeleton } from "./StopItem";
import { type BasicStop, type ExtendedStop } from "./stopsSlice";

interface StopListProps extends ViewProps {
  stops?: ExtendedStop[];
  inRoute?: BasicRoute;
  renderRoute?: (route: BasicRoute) => React.JSX.Element;
  renderRouteSkeleton?: () => React.JSX.Element;
  /** Called when the stop item is clicked on. */
  onPress: (stop: BasicStop) => void;
}

/**
 * Screen that displays a list of stops.
 */
const StopList = ({
  stops,
  inRoute,
  renderRoute,
  renderRouteSkeleton,
  onPress,
}: StopListProps): React.JSX.Element => {
  const sortedStops = sortStopsByDistance(stops);
  return (
    <View style={[LayoutStyle.fill]}>
      {sortedStops !== undefined ? (
        <BottomSheetSectionList
          sections={[
            {
              route: inRoute,
              data: sortedStops,
            },
          ]}
          focusHook={useFocusEffect}
          style={styles.stopContainer}
          renderItem={({ item }) => (
            <StopItem stop={item} inRoute={inRoute} onPress={onPress} />
          )}
          renderSectionHeader={({ section: { route } }) => {
            if (
              renderRoute === undefined ||
              renderRouteSkeleton === undefined
            ) {
              return null;
            }
            return route !== undefined
              ? renderRoute(route)
              : renderRouteSkeleton();
          }}
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

function sortStopsByDistance(stops?: BasicStop[]): BasicStop[] | undefined {
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
