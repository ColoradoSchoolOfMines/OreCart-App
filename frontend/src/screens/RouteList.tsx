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

const RouteList: React.FC<ViewProps> = () => {
  const [routeState, setRouteState] = useState<RequestState<Routes>>({
    type: "loading",
  });

  function loadRoutes(): void {
    getRoutes()
      .then((routes) => {
        setRouteState({ type: "ok", routes });
      })
      .catch((e) => {
        setRouteState({ type: "error", message: e.toString() });
      })
  }

  useEffect(() => {
    loadRoutes();
  }, []);

  const retryFetchRoutes = (): void => {
    setRouteState({ type: "loading" });
    loadRoutes();
  };

  return (
    <View style={[LayoutStyle.fill]}>
      {routeState.type === "loading" ? (
        <View style={styles.routeContainer}>
          <SkeletonList generator={() => <RouteItemSkeleton />} />
        </View>
      ) : routeState.type === "ok" ? (
        <FlatList
          style={styles.routeContainer}
          data={routeState.routes}
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
            <View>
              <Text style={styles.retryButtonText}>Retry</Text>
            </View>
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
