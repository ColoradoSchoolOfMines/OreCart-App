import React from 'react'
import { View, Text, Dimensions, type ViewProps, Button } from 'react-native'
import { Map } from './components/Map'
import { useState, useEffect } from 'react'
import { type Coordinate, subscribeUserLocation } from './services/location'
import { Sheet } from './components/Sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Screen_A } from './screens/Screen_A'
import { Screen_B } from './screens/Screen_B'
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { IconButton } from './components/IconButton';
import { Drawer } from 'react-native-drawer-layout';
import { NavigationContainer } from '@react-navigation/native';

/**
 * Controls the percentage of the screen taken up by the bottom sheet in
 * it's collapsed state.
 */
const SHEET_EXTENT = 0.5

/**
 * The main screen containing the map and sheet components.
 */
export function Main(_: ViewProps): React.ReactElement<void> {

  // The bottom sheet extends halfway across the screen, with the map
  // being inset accordingly.
  const screenHeight = Dimensions.get('window').height
  const [open, setOpen] = React.useState(false);
  const mapInsets = {
    top: 0,
    left: 0,
    // Inset the map so that elements are not obscured by the bottom sheet
    bottom: screenHeight * SHEET_EXTENT,
    right: 0
  }

  return (
        <Drawer
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          renderDrawerContent={() => {
          return <Text>Drawer content</Text>;
          }}
        >
          <GestureHandlerRootView>
          <IconButton
            onPress={() => setOpen((prevOpen) => !prevOpen)}>
            <MaterialIcons name="menu" size={35} color="black" />
          </IconButton>
          <Map insets={mapInsets} />
          <Sheet collapsedExtent={SHEET_EXTENT}>
            <View>
              <Text>Hello World</Text>
            </View>
          </Sheet>
          </GestureHandlerRootView>
        </Drawer>
    )
  }

