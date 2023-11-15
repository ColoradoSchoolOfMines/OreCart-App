import React from 'react'
import { View, Text, Dimensions, type ViewProps } from 'react-native'
import Map from './components/Map'
import Sheet from './components/Sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LayoutStyle from './style/layout'

/**
 * Controls the percentage of the screen taken up by the bottom sheet in
 * it's collapsed state.
 */
const SHEET_EXTENT = 0.5

/**
 * The main screen containing the map and sheet components.
 */
const Main: React.FC<ViewProps> = () => {
  // The bottom sheet extends halfway across the screen, with the map
  // being inset accordingly.
  const screenHeight = Dimensions.get('window').height
  const mapInsets = { bottom: screenHeight * SHEET_EXTENT }

  return (
    <GestureHandlerRootView>
      <Map style={LayoutStyle.fill}
        insets={mapInsets} />
      <Sheet collapsedExtent={SHEET_EXTENT}>
        <View>
          <Text>Hello World</Text>
        </View>
      </Sheet>
    </GestureHandlerRootView>
  )
}

export default Main;
