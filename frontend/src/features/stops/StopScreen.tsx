import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";

import ErrorMessage from "../../common/components/ErrorMessage";
import TextSkeleton from "../../common/components/TextSkeleton";
import { type InnerParamList } from "../../common/navTypes";
import Color from "../../common/style/color";
import { useLocationStatus } from "../location/locationSlice";
import { distance, formatMiles, geoDistanceToMiles } from "../location/util";
import RouteList from "../routes/RouteList";
import { useGetRoutesQuery } from "../routes/routesSlice";

import { useGetStopQuery, type Stop } from "./stopsSlice";

export interface StopScreenProps {
  navigation: StackNavigationProp<InnerParamList, "Stop">;
  route: RouteProp<InnerParamList, "Stop">;
}

export const StopScreen = ({
  route,
  navigation,
}: StopScreenProps): React.JSX.Element => {
  console.log(route.params.stopId);

  const {
    data: stop,
    isSuccess: stopSuccess,
    isLoading: stopLoading,
    isError: stopError,
    refetch: refetchStops,
  } = useGetStopQuery(route.params.stopId);

  const {
    data: routes,
    isError: routesError,
    refetch: refetchRoutes,
  } = useGetRoutesQuery();

  function retryStop(): void {
    refetchStops().catch(console.error);
  }

  function retryRoutes(): void {
    refetchRoutes().catch(console.error);
  }

  let stopRoutes;
  if (routes !== undefined && stop !== undefined) {
    stopRoutes = routes.filter((route) => stop.routeIds.includes(route.id));
  }

  return (
    <View>
      {stopSuccess ? (
        <StopHeader stop={stop} />
      ) : stopLoading ? (
        <StopSkeleton />
      ) : stopError ? (
        <ErrorMessage
          message="We couldn't fetch this stop right now. Try again later."
          retry={() => {
            retryStop();
          }}
        />
      ) : null}

      {routesError ? (
        <ErrorMessage
          message="We couldn't fetch the routes right now. Try again later."
          retry={() => {
            retryRoutes();
          }}
        />
      ) : (
        <RouteList
          mode="basic"
          routes={stopRoutes}
          onPress={(route) => {
            navigation.push("Route", { routeId: route.id });
          }}
        />
      )}
    </View>
  );
};

const StopHeader = ({ stop }: { stop: Stop }): React.JSX.Element => {
  console.log(stop);
  const status = useLocationStatus();
  let stopDistance;
  if (status.type === "active") {
    stopDistance = formatMiles(
      geoDistanceToMiles(distance(stop, status.location))
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.stopName}>{stop.name}</Text>
      {status.type === "active" ? (
        <Text style={styles.stopDesc}>{stopDistance} away</Text>
      ) : status.type === "initializing" ? (
        <TextSkeleton style={styles.stopDesc} widthFraction={0.3} />
      ) : null}
      <TouchableHighlight
        underlayColor={Color.generic.location_highlight}
        style={[styles.button, styles.locationButton]}
        onPress={() => {
          // Add your logic here
        }}
      >
        <Text style={styles.buttonText}>Get Directions</Text>
      </TouchableHighlight>
    </View>
  );
};

const StopSkeleton = (): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <TextSkeleton style={styles.stopName} widthFraction={0.4} />
      <TextSkeleton style={styles.stopDesc} widthFraction={0.3} />
      <View style={[styles.button, styles.buttonSkeleton]}>
        <Text style={styles.buttonText}></Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  stopName: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  stopDesc: {
    fontSize: 16,
  },
  routeItemSkeleton: {
    padding: 16,
    backgroundColor: Color.generic.selection,
    borderRadius: 16,
  },
  routeItem: {
    backgroundColor: Color.generic.alert.primary,
    borderRadius: 16,
    padding: 16,
  },
  header: {
    textAlign: "center",
    paddingBottom: 16,
  },
  button: {
    borderRadius: 100,
    padding: 10,
    marginTop: 16,
    alignItems: "center",
  },
  locationButton: {
    backgroundColor: Color.generic.location,
  },
  buttonSkeleton: {
    backgroundColor: Color.generic.skeleton,
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
});
