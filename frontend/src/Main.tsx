import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Dimensions,
  type ViewProps,
  StyleSheet,
  StatusBar
} from "react-native";
import { Drawer } from "react-native-drawer-layout";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import FloatingButton from "./components/FloatingButton";
import Map from "./components/Map";
import Sheet from "./components/Sheet";
import RouteList from "./screens/RouteList";
import LayoutStyle from "./style/layout";
import SpacingStyle from "./style/spacing";

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
  const [open, setOpen] = useState(false);
  const mapInsets = { bottom: screenHeight * SHEET_EXTENT };
  const statusBarHeight = useMemo(() => StatusBar.currentHeight ?? 0, []);
  const drawerInsets = { top: statusBarHeight };

  return (
    <Drawer
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      renderDrawerContent={() => {
        return <Text style={SpacingStyle.pad(drawerInsets, 16)}>Drawer content</Text>;
      }}
    >
      <GestureHandlerRootView>
        <Map style={LayoutStyle.fill} insets={mapInsets} />
        <View style={[LayoutStyle.overlay, SpacingStyle.pad(drawerInsets, 16)]}>
          <FloatingButton
            onPress={() => {
              setOpen((prevOpen: boolean) => !prevOpen);
            }}
          >
            <MaterialIcons name="menu" size={24} color="black" />
          </FloatingButton>
        </View>
        <Sheet collapsedExtent={SHEET_EXTENT} topInset={96}>
          <RouteList />
        </Sheet>
      </GestureHandlerRootView>
    </Drawer>
  );
};

export default Main;
