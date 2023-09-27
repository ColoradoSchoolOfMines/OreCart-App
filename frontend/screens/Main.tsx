import { StyleSheet, View } from 'react-native';
import { Map } from '../components/Map'
import { useState, useEffect } from 'react';
import { Coordinate, getUserLocation } from '../services/location';

export function Main() {
  return (
    <View>
      <Map style={StyleSheet.absoluteFillObject} 
        currentLocation={{ lat: 39.749729, lon: -105.222740}} />
    </View>
  )
}
