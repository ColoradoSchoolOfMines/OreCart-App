import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  type ViewProps,
  StyleSheet,
  TouchableHighlight,
} from "react-native";

import Divider from "../components/Divider";
import { RouteItem, RouteItemSkeleton } from "../components/RouteItem";
import SkeletonList from "../components/SkeletonList";
import { type RequestState } from "../services/api";
import { getRoutes, type Routes } from "../services/routes";
import Color from "../style/color";
import LayoutStyle from "../style/layout";

/**
 * Screen that displays a list of routes.
 */
const RouteList: React.FC<ViewProps> = () => {
  const [routeState, setRouteState] = useState<RequestState<Routes>>({
    type: "loading",
  });

  function loadRoutes(): void {
    // None of the callers are in async contexts, use callbacks instead
    getRoutes()
      .then((routes) => {
        setRouteState({ type: "ok", data: routes });
      })
      .catch((e) => {
        setRouteState({ type: "error", message: e.toString() });
      });
  }

  useEffect(() => {
    loadRoutes();
  }, []);

  const retryFetchRoutes = (): void => {
    // Need to remove whatever prior state there was and go back to the initial
    // loading state.
    setRouteState({ type: "loading" });
    loadRoutes();
  };

  return (
    <View style={[LayoutStyle.fill]}>
      {routeState.type === "loading" ? (
        <SkeletonList
          style={styles.routeContainer}
          generator={() => <RouteItemSkeleton />}
        />
      ) : routeState.type === "ok" ? (
        <FlatList
          style={styles.routeContainer}
          data={routeState.data}
          renderItem={({ item }) => <RouteItem route={item} />}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={Divider}
        />
      ) : routeState.type === "error" ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.header}>
            We couldn't fetch the routes right now. Try again later.
          </Text>
          <TouchableHighlight
            style={styles.retryButton}
            onPress={retryFetchRoutes}
            underlayColor={Color.csm.primary.ext.blaster_blue_highlight}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableHighlight>
        </View>
      ) : null}
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
  retryButton: {
    borderRadius: 100,
    backgroundColor: Color.csm.primary.blaster_blue,
    padding: 10,
    alignItems: "center",
  },
  retryButtonText: {
    color: Color.generic.white,
    fontWeight: "500",
  },
});

export default RouteList;
