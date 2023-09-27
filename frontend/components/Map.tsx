import MapView from 'react-native-maps';
import { StyleSheet, ViewStyle } from 'react-native';

export function Map(props: MapProps) {
  return (
    <MapView style={styles.map} />
  )
}

export interface MapProps {
  style: ViewStyle
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%'
  }
})
