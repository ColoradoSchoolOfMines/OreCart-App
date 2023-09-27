import { StyleSheet } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaView } from 'react-native';
import { Main } from './screens/Main'

// TODO/Stretch: Implement "true" edge-to-edge functionality (requires native code)
NavigationBar.setBackgroundColorAsync("white")

export default function App() {
  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Main />
    </SafeAreaView>
  );
}
