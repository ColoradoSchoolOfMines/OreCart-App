import { Text, View } from "react-native";

import { type SettingsScreenProps } from "../../common/navTypes";

export const Settings = ({
  route,
  navigation,
}: SettingsScreenProps): React.JSX.Element => {
  return (
    <View>
      <Text>Hello!</Text>
    </View>
  );
};
