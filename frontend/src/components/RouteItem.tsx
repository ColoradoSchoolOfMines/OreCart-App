import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View, StyleSheet, TouchableHighlight } from "react-native";

import { type Route } from "../services/routes";

interface RouteItemProps {
  route: Route;
}

const RouteItem: React.FC<RouteItemProps> = ({ route }) => {
  const handlePress = (): void => {
    // TODO: Stub
  };

  return (
    <TouchableHighlight
      onPress={handlePress}
      underlayColor="#DDDDDD"
      style={styles.touchable}
    >
      <View style={styles.container}>
        <View style={styles.routeInfo}>
          <Text style={styles.routeName}>{route.name}</Text>
          <Text>
            Next OreCart in <Text style={styles.boldText}>5 min</Text>
          </Text>
        </View>
        <MaterialIcons name="arrow-forward" size={24} color="black" />
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  boldText: {
    fontWeight: "bold",
  },
  touchable: {
    borderRadius: 16,
  },
});

export default RouteItem;
