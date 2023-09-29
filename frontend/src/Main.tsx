import { StyleSheet, View } from 'react-native'
import { Map } from './components/Map'
import { useState, useEffect } from 'react'
import { type Coordinate, subscribeUserLocation } from './services/location'

/**
 * The main screen containing the map and bottom sheet pattern.
 */
export function Main(): React.ReactElement<void> {
  const [location, setLocation] = useState<Coordinate | null>(null)

  useEffect(() => {
    const promise = subscribeUserLocation(setLocation)
    // Clean up memory once component unmounts
    return () => {
      promise
        .then((watcher) => { watcher.remove() })
        .catch(console.error)
    }
  }, [])

  return (
    <View>
      <Map style={StyleSheet.absoluteFillObject}
        currentLocation={location} />
    </View>
  )
}