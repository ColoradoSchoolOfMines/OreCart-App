import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, Dimensions, type ViewProps } from "react-native";
import { Drawer } from "react-native-drawer-layout";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FloatingButton from "../common/components/FloatingButton";
import LayoutStyle from "../common/style/layout";
import SpacingStyle from "../common/style/spacing";
import { manageLocationMiddleware } from "../features/location/locationMiddleware";
import Map from "../features/map/Map";
import Sheet from "../features/navigation/Sheet";
import RouteList from "../features/routes/RouteList";
import AlertList from "../features/alert/AlertList";

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
  const insets = useSafeAreaInsets();
  const drawerInsets = { top: insets.top };

  manageLocationMiddleware();

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
        return (
          <Text style={SpacingStyle.pad(drawerInsets, 16)}>Drawer content</Text>
        );
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
        {/* Must inset bottom sheet down by the drawer button (16 + 8 + 48 + 8 + 16) */}
        <Sheet collapsedFraction={SHEET_EXTENT} expandedInset={96}>
          <AlertList />
          <RouteList />
        </Sheet>
      </GestureHandlerRootView>
    </Drawer>
  );
};

export default Main;
