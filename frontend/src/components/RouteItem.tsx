import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View, StyleSheet, TouchableHighlight } from "react-native";

import { type Route } from "../services/routes";
import Color from "../style/color";

interface RouteItemProps {
  route: Route;
}

const RouteItem: React.FC<RouteItemProps> = ({ route }) => {
  const handlePress = (): void => {
    // TODO: Stub
  };

  const routeNameColorStyle = { color: Color.generic.black };

  // TODO: Idiotic temporary hack, remove immediately
  switch (route.name) {
    case "Tungsten":
      routeNameColorStyle.color = Color.orecart.tungsten;
      break;
    case "Silver":
      routeNameColorStyle.color = Color.orecart.silver;
      break;
    case "Gold":
      routeNameColorStyle.color = Color.orecart.gold;
      break;
  }

  return (
    <TouchableHighlight
      onPress={handlePress}
      underlayColor={Color.generic.selection}
      style={styles.touchable}
    >
      <View style={styles.container}>
        <View style={styles.routeInfo}>
          <Text style={[styles.routeName, routeNameColorStyle]}>
            {route.name}
          </Text>
          {route.isActive ? 
          <Text>
            Next OreCart in <Text style={styles.boldText}>5 min</Text>
          </Text>
          : <Text>Not running</Text> }
        </View>
        <MaterialIcons
          name="arrow-forward"
          size={24}
          color={Color.generic.black}
        />
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
