import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { View } from "react-native";

import { type OuterParamList } from "../../common/navTypes";
import AlertBanner from "../alert/AlertBanner";
import LocationPermissionPrompt from "../location/LocationPermissionPrompt";
import RouteList from "../routes/RouteList";


export interface LandingScreenProps {
  navigation: StackNavigationProp<OuterParamList, "Landing">;
  route: RouteProp<OuterParamList, "Landing">;
}

export const LandingScreen = ({
  route,
  navigation,
}: LandingScreenProps): React.JSX.Element => {
  return (
    <View>
        <AlertBanner />
        <LocationPermissionPrompt />
        <RouteList />
    </View>
  );
};
