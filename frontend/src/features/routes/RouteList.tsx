import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

import Divider from "../../common/components/Divider";
import SkeletonList from "../../common/components/SkeletonList";
import LayoutStyle from "../../common/style/layout";

import { RouteItem, RouteItemSkeleton } from "./RouteItem";
import { type ExtendedRoute } from "./routesSlice";

interface RouteListProps {
  mode: "basic" | "extended";
  routes: ExtendedRoute[] | undefined;
  onPress: (route: ExtendedRoute) => void;
}

/**
 * Screen that displays a list of routes.
 */
const RouteList = ({
  mode,
  routes,
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
        <FlatList
          style={styles.routeContainer}
          data={routes}
          renderItem={({ item }) => (
            <RouteItem mode={mode} route={item} onPress={onPress} />
          )}
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
