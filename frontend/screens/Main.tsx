import { StyleSheet, View } from 'react-native';
import { Map } from '../components/Map'
import { useState, useEffect } from 'react';
import { Coordinate, getUserLocation } from '../services/location';

export function Main() {
  let [location, setLocation] = useState<Coordinate | null>(null)

  useEffect(() => {
    (async () => {
      const coords = await getUserLocation();
      setLocation(coords);
    })();
  }, []);

  return (
    <View>
      <Map style={StyleSheet.absoluteFillObject} 
        currentLocation={location ? location : { lat: 39.7512546, lon: -105.2195490 }} />
    </View>
  )
}
