<<<<<<< HEAD
<<<<<<< HEAD
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  Dimensions,
  type ViewProps,
  StyleSheet,
} from "react-native";
import { Drawer } from "react-native-drawer-layout";
=======
import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, type ViewProps } from "react-native";
>>>>>>> 6280e4c (frontend: add route query scaffold)
=======
import React from "react";
import { View, Dimensions, type ViewProps } from "react-native";
>>>>>>> 75a3c12 (frontend/screens: add route list screen)
import { GestureHandlerRootView } from "react-native-gesture-handler";

import FloatingButton from "./components/FloatingButton";
import Map from "./components/Map";
import Sheet from "./components/Sheet";
import RouteList from "./screens/RouteList";
import LayoutStyle from "./style/layout";

/**
 * Controls the percentage of the screen taken up by the bottom sheet in
 * it's collapsed state.
 */
const SHEET_EXTENT = 0.5;

/**
 * The main screen containing the map and sheet components.
 */
const Main: React.FC<ViewProps> = () => {
  // The bottom sheet extends halfway across the screen, with the map
  // being inset accordingly.
  const screenHeight = Dimensions.get("window").height;
  const [open, setOpen] = React.useState(false);
  const mapInsets = { bottom: screenHeight * SHEET_EXTENT };

  return (
<<<<<<< HEAD
    <Drawer
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      renderDrawerContent={() => {
        return <Text>Drawer content</Text>;
      }}
    >
      <GestureHandlerRootView>
        <Map style={LayoutStyle.fill} insets={mapInsets} />
        <View style={[LayoutStyle.overlay, styles.drawerButtonContainer]}>
          <FloatingButton
            onPress={() => {
              setOpen((prevOpen: boolean) => !prevOpen);
            }}
          >
            <MaterialIcons name="menu" size={24} color="black" />
          </FloatingButton>
        </View>
        <Sheet collapsedExtent={SHEET_EXTENT}>
          <RouteList />
        </Sheet>
      </GestureHandlerRootView>
    </Drawer>
  );
};

const styles = StyleSheet.create({
  drawerButtonContainer: { padding: 16 },
});

export default Main;
