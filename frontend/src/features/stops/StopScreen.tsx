import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

import RetryButton from "../../common/components/RetryButton";
import SkeletonList from "../../common/components/SkeletonList";
import Spacer from "../../common/components/Spacer";
import Color from "../../common/style/color";

import { type InnerParamList } from "../../common/navTypes";
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
    data: stops,
    isLoading,
    isSuccess,
    isError,
    refetch,
  } = useGetStopQuery(route.params.stopId);

  // const {
  //   data: routeItems,
  //   routesLoading,
  //   routesSuccess,
  //   routesError,
  //   routesRefetch,
  // } = useGetRoutesQuery();
  
  function retry(): void {
    refetch().catch(console.error);
  }

  // function retryRoutes(): void {
  //   routesRefetch().catch(console.error);
  // }

// Stop screen renders stop title, stop distance  and route items 

// query route items

  return (
    <View style={[styles.container]}>
      {isLoading ? (
        <SkeletonList
          divider={false}
          generator={() => (
            <View style={styles.alertItemSkeleton}>
              {/* <AlertItemSkeleton /> */}

              {/* TODO implement skeleton */}
            </View>
          )}
        />
      ) : isSuccess ? (
        <FlatList
          data={stops}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={Spacer}
          renderItem={({ item }) => (
            <View style={[styles.alertItem]}>
              {/* <StopItem stop={item} onPress={ navigation.push('') } /> */}
              {/* onpress, navigate to route screen */}
            </View>
          )}
          refreshControl={
            // We only want to indicate refreshing when prior data is available.
            // Otherwise, the skeleton list will indicate loading
            <RefreshControl
              refreshing={isLoading && stops !== undefined}
              onRefresh={retry}
            />
          }
        />
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
  alertItemSkeleton: {
    padding: 16,
    backgroundColor: Color.generic.selection,
    borderRadius: 16,
  },
  alertItem: {
    backgroundColor: Color.generic.alert.primary,
    borderRadius: 16,
    padding: 16,
  },
  header: {
    textAlign: "center",
    paddingBottom: 16,
  },
});
