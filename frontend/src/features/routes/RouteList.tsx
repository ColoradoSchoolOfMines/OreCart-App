import { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";

import Divider from "../../common/components/Divider";
import SkeletonList from "../../common/components/SkeletonList";
import LayoutStyle from "../../common/style/layout";
import { type BasicStop } from "../stops/stopsSlice";

import { RouteItem, RouteItemSkeleton } from "./RouteItem";
import { type ExtendedRoute } from "./routesSlice";

interface RouteListProps {
  mode: "basic" | "extended";
  routes: ExtendedRoute[] | undefined;
  inStop?: BasicStop;
  defaultHeader: () => React.JSX.Element;
  renderStop?: (route: BasicStop) => React.JSX.Element;
  renderStopSkeleton?: () => React.JSX.Element;
  onPress: (route: ExtendedRoute) => void;
}

/**
 * Screen that displays a list of routes.
 */
const RouteList = ({
  mode,
  routes,
  inStop,
  defaultHeader,
  renderStop,
  renderStopSkeleton,
  onPress,
}: RouteListProps): React.JSX.Element => {
  return (
    <View style={[LayoutStyle.fill]}>
      {routes === undefined ? (
        <SkeletonList
          style={styles.routeContainer}
          divider={true}
          generator={() => <RouteItemSkeleton />}
        />
      ) : (
        <BottomSheetSectionList
          style={styles.routeContainer}
          sections={[
            {
              stop: inStop,
              data: routes,
            },
          ]}
          focusHook={useFocusEffect}
          renderItem={({ item }) => (
            <RouteItem
              mode={mode}
              route={item}
              inStop={inStop}
              onPress={onPress}
            />
          )}
          renderSectionHeader={({ section: { stop } }) => {
            if (renderStop === undefined || renderStopSkeleton === undefined) {
              return defaultHeader();
            }
            return stop !== undefined ? renderStop(stop) : renderStopSkeleton();
          }}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={Divider}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  routeContainer: {
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

export default RouteList;
