import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

import RetryButton from "../../common/components/RetryButton";
import SkeletonList from "../../common/components/SkeletonList";
import Spacer from "../../common/components/Spacer";
import Color from "../../common/style/color";

import { type InnerParamList } from "../../common/navTypes";
import { RouteItem, RouteItemSkeleton } from "../routes/RouteItem";
import { useGetRoutesQuery } from "../routes/routesSlice";
import { useGetStopQuery } from "./stopsSlice";

export interface StopScreenProps {
  navigation: StackNavigationProp<InnerParamList, "Stop">;
  route: RouteProp<InnerParamList, "Stop">;
}

export const StopScreen = ({
  route,
  navigation,
}: StopScreenProps): React.JSX.Element => {
  const {
    data: stop,
    isLoading,
    isSuccess,
    isError,
    refetch,
  } = useGetStopQuery(route.params.stopId);

  const {
    data: routes,
    isError: routesError,
    refetch: refetchRoutes,
  } = useGetRoutesQuery();

  function retry(): void {
    refetch().catch(console.error);
  }
  
  function retryRoutes(): void {
    refetchRoutes().catch(console.error);
  }

  const filteredRoutes = routes?.filter((route) => stop?.stopIds.includes(route.id));

  return (
    <View style={[styles.container]}>
      {isLoading ? (
        <SkeletonList
          divider={false}
          generator={() => (
            <View style={styles.routeItemSkeleton}>
              <RouteItemSkeleton />
            </View>
          )}
        />
      ) : isSuccess ? (
        <View>
          <Text>{stop.name}</Text>
          <FlatList
            data={filteredRoutes}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={Spacer}
            renderItem={({ item }) => (
              <View style={[styles.routeItem]}>
                <RouteItem 
                  route={item} 
                  onPress={() => { 
                    navigation.push("Route", { routeId: item.id }) 
                  }} 
                  />
              </View>
            )}
            refreshControl={
              // We only want to indicate refreshing when prior data is available.
              // Otherwise, the skeleton list will indicate loading
              <RefreshControl
                refreshing={isLoading && filteredRoutes !== undefined}
                onRefresh={retry}
              />
            }
          />
        </View>
      ) : isError ? (
        <>
          <Text style={styles.header}>
            We couldn't fetch stops right now. Try again later.
          </Text>
          <RetryButton retry={retry} />
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
});
