import React from "react";
import { View } from "react-native";

/**
 * A transparent spacer that can be used to divide elements in a list. Always use this
 * when a transparent spacer is needed.
 */
const Spacer = (): React.JSX.Element => {
  return <View style={{ height: 8 }} />;
};

export default Spacer;
