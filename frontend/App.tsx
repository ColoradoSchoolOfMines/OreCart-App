// import { StatusBar } from 'expo-status-bar';
import MapView from 'react-native-maps';
import { Marker, LatLng } from 'react-native-maps';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaView } from 'react-native';
import { useState } from 'react';

NavigationBar.setBackgroundColorAsync("white")

export default function App() {
  return (
    // TOOD/Stretch: Implement "true" edge-to-edge functionality (requires native code)
    <SafeAreaView style={styles.container}>
      <OreCartApp />
    </SafeAreaView>
  );
}

function OreCartApp() {
  let [coordinate, setCoordinate] = useState<LatLng>({ 
    // TODO: Replace with user location
    latitude: 39.7512546,
    longitude: -105.2195490 }
  )

  return (
    <View style={styles.main}>
      <MapView  style={styles.map} 
                initialRegion={{
                  latitude: coordinate.latitude,
                  longitude: coordinate.longitude,
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.002,
                }}>
        <Marker coordinate={coordinate} />
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  main: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%'
  }
});
