import { StyleSheet, SafeAreaView } from 'react-native'
import * as NavigationBar from 'expo-navigation-bar'
import Main from './src/Main'

// -----
// DO NOT PUT ANY SUBSTANTIAL UI OR LOGIC INTO THIS FILE. ONLY INCLUDE SYSTEM CONFIGURATION.
// -----

NavigationBar.setBackgroundColorAsync('white').catch(console.error)

const App: React.FC<void> = () => (
  <SafeAreaView style={StyleSheet.absoluteFillObject}>
    <Main style={StyleSheet.absoluteFillObject} />
  </SafeAreaView>
)

export default App