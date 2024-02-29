import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";

import List from "../../common/components/List";
import { type InnerParamList } from "../../common/navTypes";
import { wrapReduxQuery } from "../../common/query";
import AlertBanner from "../alert/AlertBanner";
import { useGetActiveAlertsQuery, type Alert } from "../alert/alertSlice";
import LocationPermissionPrompt from "../location/LocationPermissionPrompt";
import { changeMapFocus, type MapFocus } from "../map/mapSlice";
import { useGetRoutesQuery, type ParentRoute } from "../routes/routesSlice";

import { RouteItem, RouteItemSkeleton } from "./RouteItem";

export interface LandingScreenProps {
  navigation: StackNavigationProp<InnerParamList, "Landing">;
  route: RouteProp<InnerParamList, "Landing">;
}

export const LandingScreen = ({
  route,
  navigation,
}: LandingScreenProps): React.JSX.Element => {
  const routes = useGetRoutesQuery();
  const alerts = useGetActiveAlertsQuery();
  const focus: MapFocus | undefined = routes.isSuccess
    ? {
        type: "None",
      }
    : undefined;
  changeMapFocus(focus);

  return (
    <List
      header={() => (
        <View>
          <AlertBanner
            alerts={wrapReduxQuery<Alert[]>(alerts)}
            refresh={alerts.refetch}
          />
          <LocationPermissionPrompt />
        </View>
      )}
      item={(route: ParentRoute) => (
        <RouteItem
          route={route}
          onPress={(route: ParentRoute) => {
            navigation.navigate("Route", { routeId: route.id });
          }}
        />
      )}
      itemSkeleton={() => <RouteItemSkeleton />}
      divider="line"
      query={wrapReduxQuery<ParentRoute[]>(routes)}
      refresh={async () => await routes.refetch().then(alerts.refetch)}
      keyExtractor={(route: ParentRoute) => route.id.toString()}
      errorMessage="Failed to load routes. Please try again."
    />
  );
};

const styles = StyleSheet.create({
  message: {
    margin: 16,
  },
});
