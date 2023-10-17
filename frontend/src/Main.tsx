import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Map } from './components/Map'
import { Sheet } from './components/Sheet'

/**
 * The main screen containing the map and sheet components.
 */
export function Main(): React.ReactElement<void> {
  return (
    <View>
      <Map style={StyleSheet.absoluteFillObject} />
      <Sheet>
        <View>
          <Text>Paula</Text>
          <Text>Brilliant</Text>
        </View>
      </Sheet>
    </View>
  )
}
