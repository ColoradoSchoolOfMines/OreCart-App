import React from 'react'
import { StyleSheet, View, Text, Dimensions } from 'react-native'
import { Map } from './components/Map'
import { Sheet } from './components/Sheet'

/**
 * The main screen containing the map and sheet components.
 */
export function Main(): React.ReactElement<void> {
  const halfwayInset = Dimensions.get('window').height / 2

  return (
    <View>
      <Map style={StyleSheet.absoluteFillObject} 
        insets={{top: 0, left: 0, bottom: halfwayInset, right: 0}} />
      <Sheet collapsedExtent='50%'>
        <View>
          <Text>Paula</Text>
          <Text>Brilliant</Text>
        </View>
      </Sheet>
    </View>
  )
}
