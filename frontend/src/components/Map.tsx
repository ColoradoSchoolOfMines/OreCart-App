import MapView, { type Region, PROVIDER_GOOGLE, type Details } from 'react-native-maps'
import { View, StyleSheet, type ViewProps, StatusBar, type LayoutProps } from 'react-native'
import { type Coordinate } from '../services/location'
import LocationButton from './LocationButton'
import React, { useRef, useMemo, useState } from 'react'

export interface MapRef{
  poke: () => void
}

const GOLDEN: Region = {
  latitude: 39.749675,
  longitude: -105.222606,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005
}

export function Map(props: MapProps & ViewProps): React.ReactElement<MapProps & ViewProps> {
  const mapRef = useRef<MapView>(null)
  const [followingLocation, setFollowingLocation] = useState<boolean>(true)
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
    if (followingLocation) {
      panToLocation(location)
    }
  }

  function handleRegionChange(details: Details): void {
    if (details.isGesture ?? true) {
      setFollowingLocation(false)
    }
  }

  function flipFollowingLocation(): void {
    const newState = !followingLocation
    if (newState) {
      panToLocation(lastLocation)
    }
    setFollowingLocation(newState)
  }

  const statusBarInset = useMemo(() => StatusBar.currentHeight ?? 0, [])
  const padding = {
    top: props.insets?.left ?? 0 + statusBarInset,
    left: props.insets?.left ?? 0,
    bottom: props.insets?.bottom ?? 0,
    right: props.insets?.right ?? 0
  }

  const locationButtonContainerStyle: LayoutProps = {
    ...StyleSheet.absoluteFillObject,
    paddingTop: padding.top + 16,
    paddingBottom: padding.bottom + 16,
    paddingLeft: padding.left + 16,
    paddingRight: padding.right + 16,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  }

  return (
    <View>
      <MapView style={styles.innerMap}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        initialRegion={GOLDEN}
        showsUserLocation={true}
        showsMyLocationButton={false}
        mapPadding={padding}
        onUserLocationChange={event => { updateLocation(event.nativeEvent.coordinate) }}
        onRegionChange={(_region, details) => { handleRegionChange(details) }} />
      <View style={locationButtonContainerStyle}>
        <LocationButton isActive={followingLocation} 
          onPress={() => { flipFollowingLocation() }} />
      </View>
    </View>
  )
}

export interface MapProps {
  insets?: Insets
}

export interface Insets {
  top: number,
  left: number,
  bottom: number,
  right: number
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  innerMap: {
    width: '100%',
    height: '100%'
  }
})
