import { StyleSheet, View } from 'react-native'
import { Map } from '../components/Map'

export function Main (): any {
  return (
    <View>
      <Map style={StyleSheet.absoluteFillObject} />
    </View>
  )
}
