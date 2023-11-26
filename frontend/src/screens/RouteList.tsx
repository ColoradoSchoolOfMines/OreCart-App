import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  type ViewProps,
  type ListRenderItem,
  StyleSheet,
  TouchableHighlight,
} from "react-native";

import Divider from "../components/Divider";
import RouteItem from "../components/RouteItem";
import { getRoutes, type Routes, type Route } from "../services/routes";
import LayoutStyle from "../style/layout";

type RouteState = Ok | Error | Loading;

interface Ok {
  type: "ok";
  routes: Routes;
}

interface Error {
  type: "error";
  message: string;
}

interface Loading {
  type: "loading";
}

const RouteList: React.FC<ViewProps> = () => {
  const [routeState, setRouteState] = useState<RouteState>({ type: "loading" });

  function loadRoutes(): void {
    getRoutes()
      .then((routes) => {
        setRouteState({ type: "ok", routes });
      })
      .catch((e) => {
        setRouteState({ type: "error", message: e.toString() });
      });
  }

  useEffect(() => {
    loadRoutes();
  }, []);

  const renderRouteItem: ListRenderItem<Route> = ({ item }) => (
    <RouteItem route={item} />
  );

  const renderSeparator: React.FC<ViewProps> = () => <Divider />;

  const retryFetchRoutes = (): void => {
    setRouteState({ type: "loading" });
    loadRoutes();
  };

  return (
    <View style={[LayoutStyle.fill]}>
      {routeState.type === "loading" ? (
        <ActivityIndicator
          style={styles.loadingContainer}
          size="large"
          color="#0000ff"
        />
      ) : routeState.type === "error" ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.header}>
            We couldn't fetch the routes right now. Try again later.
          </Text>
          <TouchableHighlight
            style={styles.retryButton}
            onPress={retryFetchRoutes}
            underlayColor="#6060ff"
          >
            <View>
              <Text style={styles.retryButtonText}>Retry</Text>
            </View>
          </TouchableHighlight>
        </View>
      ) : (
        <FlatList
          style={styles.routeContainer}
          data={routeState.routes}
          renderItem={renderRouteItem}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={renderSeparator}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  routeContainer: {
    paddingHorizontal: 8
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
    backgroundColor: "#0000ff",
    padding: 10,
    alignItems: "center",
  },
  retryButtonText: {
    color: "#ffffff",
  },
});

export default RouteList;
