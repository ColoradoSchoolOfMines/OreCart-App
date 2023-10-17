import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, SafeAreaView } from 'react-native'
import * as NavigationBar from 'expo-navigation-bar'
import { Main } from './src/Main'

// -----
// DO NOT PUT ANY SUBSTANTIAL UI OR LOGIC INTO THIS FILE. ONLY INCLUDE SYSTEM CONFIGURATION.
// -----

NavigationBar.setBackgroundColorAsync('white').catch(console.error)

export default function App(): React.ReactElement<void> {
  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <GestureHandlerRootView style={StyleSheet.absoluteFillObject}>
        <Main />
      </GestureHandlerRootView>
    </SafeAreaView>
  )
}
