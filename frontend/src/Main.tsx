import { StyleSheet, View } from 'react-native'
import { Map } from './components/Map'

/**
 * The main screen containing the map and bottom sheet pattern.
 */
export function Main(): React.ReactElement<void> {
  return (
    <View>
      <Map style={StyleSheet.absoluteFillObject} />
    </View>
  )
}
