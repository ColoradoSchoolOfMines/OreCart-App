import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { View } from "react-native";

import ErrorMessage from "../../common/components/ErrorMessage";
import { type InnerParamList } from "../../common/navTypes";
import AlertBanner from "../alert/AlertBanner";
import LocationPermissionPrompt from "../location/LocationPermissionPrompt";
import RouteList from "../routes/RouteList";
import { useGetRoutesQuery } from "../routes/routesSlice";

export interface LandingScreenProps {
  navigation: StackNavigationProp<InnerParamList, "Landing">;
  route: RouteProp<InnerParamList, "Landing">;
}

export const LandingScreen = ({
  route,
  navigation,
}: LandingScreenProps): React.JSX.Element => {
  const { data: routes, isError, refetch } = useGetRoutesQuery();

  function retry(): void {
    refetch().catch(console.error);
  }

  return (
    <View>
      {isError ? (
        <ErrorMessage
          message="We couldn't fetch the routes right now. Try again later."
          retry={() => {
            retry();
          }}
        />
      ) : (
        <RouteList
          mode="extended"
          routes={routes}
          onPress={(route) => {
            navigation.push("Route", { routeId: route.id });
          }}
          defaultHeader={() => (
            <View>
              <AlertBanner />
              <LocationPermissionPrompt />
            </View>
          )}
        />
      )}
    </View>
  );
};
