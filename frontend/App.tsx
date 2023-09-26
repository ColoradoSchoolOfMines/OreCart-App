// import { StatusBar } from 'expo-status-bar';
import MapView from 'react-native-maps';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaView } from 'react-native';

NavigationBar.setBackgroundColorAsync("white")

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <OreCart />
    </SafeAreaView>
  );
}

function OreCart() {
  return (
    <View style={styles.main}>
      <MapView style={styles.map} />
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
