import React from 'react'
import { StyleSheet, View, Text, Dimensions } from 'react-native'
import { Map } from './components/Map'
import { Sheet } from './components/Sheet'

/**
 * The main screen containing the map and sheet components.
 */
export function Main(): React.ReactElement<void> {
  // The bottom sheet extends halfway across the screen, with the map
  // being inset accordingly.
  const halfwayExtent = 0.5
  const halfwayInset = Dimensions.get('window').height * halfwayExtent
  const mapInsets = { top: 0, left: 0, bottom: halfwayInset, right: 0 }

  return (
    <View>
      <Map style={StyleSheet.absoluteFillObject} 
        insets={mapInsets} />
      <Sheet collapsedExtent={halfwayExtent}>
        <View>
          <Text>Paula</Text>
          <Text>Brilliant</Text>
        </View>
      </Sheet>
    </View>
  )
}
