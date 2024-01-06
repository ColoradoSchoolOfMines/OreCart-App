import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { View } from "react-native";

import { type InnerParamList } from "../../common/navTypes";
import AlertBanner from "../alert/AlertBanner";
import LocationPermissionPrompt from "../location/LocationPermissionPrompt";
import RouteList from "../routes/RouteList";

export interface LandingScreenProps {
  navigation: StackNavigationProp<InnerParamList, "Landing">;
  route: RouteProp<InnerParamList, "Landing">;
}

export const LandingScreen = ({
  route,
  navigation,
}: LandingScreenProps): React.JSX.Element => {
  return (
    <View>
      <AlertBanner />
      <LocationPermissionPrompt />
      {/* Navigate to the Route screen when a route item is clicked */}
      <RouteList
        onPress={(route) => {
          navigation.push("Route", { routeId: route.id });
        }}
      />
    </View>
  );
};
