import MapView, { type Region, PROVIDER_GOOGLE, type Details } from 'react-native-maps'
import { StyleSheet, type ViewProps, StatusBar } from 'react-native'
import { type Coordinate } from '../services/location'
import React, { useRef, useMemo } from 'react'

export interface MapRef{
  poke: () => void
}

const GOLDEN: Region = {
  latitude: 39.749675,
  longitude: -105.222606,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005
}

// TODO: Move location button into this component

export const Map = React.forwardRef<MapRef, ViewProps & MapProps>((props, ref) => {
  const mapRef = useRef<MapView>(null)
  const [lastLocation, setLastLocation] = React.useState<Coordinate | undefined>(undefined)

  function panToLocation(location: Coordinate | undefined): void {
    if (location !== undefined && mapRef.current != null) {
      mapRef.current.animateCamera({
        center: location,
        zoom: 17
      })
    }
  }

  function updateLocation(location: Coordinate | undefined): void {
    setLastLocation(location)
    if (props.followingLocation) {
      panToLocation(location)
    }
  }

  function handleRegionChange(details: Details): void {
    if (details.isGesture ?? true) {
      props.onDisableFollowing()
    }
  }

  const statusBarInset = useMemo(() => StatusBar.currentHeight ?? 0, [])
  const padding = {
    top: props.insets?.left ?? 0 + statusBarInset,
    left: props.insets?.left ?? 0,
    bottom: props.insets?.bottom ?? 0,
    right: props.insets?.right ?? 0
  }

  React.useImperativeHandle(ref, () => ({
    poke: () => { 
      console.log("test2")
      panToLocation(lastLocation) 
    }
  }), [panToLocation])

  return (
    <MapView style={styles.innerMap}
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      initialRegion={GOLDEN}
      showsUserLocation={true}
      showsMyLocationButton={false}
      mapPadding={padding}
      onUserLocationChange={event => { updateLocation(event.nativeEvent.coordinate) }}
      onRegionChange={(_region, details) => { handleRegionChange(details) }} />
  )
})

export interface MapProps {
  insets?: Insets,
  followingLocation: boolean,
  onDisableFollowing: () => void
}

export interface Insets {
  top: number,
  left: number,
  bottom: number,
  right: number
}

const styles = StyleSheet.create({
  innerMap: {
    width: '100%',
    height: '100%'
  }
})
