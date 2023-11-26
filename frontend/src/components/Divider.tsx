import React from "react";
import { View, StyleSheet } from "react-native";

import Color from "../style/color";

const Divider: React.FC = () => {
  return (
    <View style={styles.divider} />
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: Color.csm.primary.pale_blue,
    margin: 8
  },
});

export default Divider;
