import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import List from "../../common/components/List";
import { type OuterParamList } from "../../common/navTypes";
import { wrapReduxQuery } from "../../common/query";

import { AlertItem, AlertItemSkeleton } from "./AlertItem";
import { useGetFutureAlertsQuery, type Alert } from "./alertSlice";

export interface AlertsScreenProps {
  navigation: StackNavigationProp<OuterParamList, "Alerts">;
  route: RouteProp<OuterParamList, "Alerts">;
}

export const AlertScreen = ({
  route,
  navigation,
}: AlertsScreenProps): React.JSX.Element => {
  const alerts = useGetFutureAlertsQuery();

  return (
    <List
      item={(alert: Alert) => <AlertItem alert={alert} />}
      itemSkeleton={() => <AlertItemSkeleton />}
      divider="space"
      query={wrapReduxQuery<Alert[]>(alerts)}
      refresh={alerts.refetch}
      keyExtractor={(alert: Alert) => alert.id.toString()}
      errorMessage="Failed to load alerts. Please try again."
    />
  );
};
