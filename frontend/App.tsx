import { StyleSheet, SafeAreaView } from 'react-native'
import * as NavigationBar from 'expo-navigation-bar'
import { Main } from './screens/Main'

// TODO/Stretch: Implement "true" edge-to-edge functionality (requires native code)
NavigationBar.setBackgroundColorAsync('white').catch(console.error)

export default function App (): any {
  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Main />
    </SafeAreaView>
  )
}
