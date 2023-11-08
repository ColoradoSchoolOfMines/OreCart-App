import { StyleSheet, View, Text, Dimensions, type ViewProps  } from 'react-native'
import { Map } from './components/Map'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import React from 'react'
import { Sheet } from './components/Sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Drawer = createDrawerNavigator()


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
  const mapInsets = {
    top: 0,
    left: 0,
    // Inset the map so that elements are not obscured by the bottom sheet
    bottom: screenHeight * SHEET_EXTENT,
    right: 0
  }

  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <Map style={StyleSheet.absoluteFill}
          insets={mapInsets} />
        <Sheet collapsedExtent={SHEET_EXTENT}>
          <View>
            <Text>Hello World</Text>
          </View>
        </Sheet>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}
