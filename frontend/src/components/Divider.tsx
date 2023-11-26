import React from "react";
import { View, StyleSheet } from "react-native";

const Divider: React.FC = () => {
  return (
    <View style={styles.divider} />
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: "#CED0CE",
    margin: 8
  },
});

export default Divider;
