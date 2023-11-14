import { SafeAreaView } from 'react-native'
import * as NavigationBar from 'expo-navigation-bar'
import { Main } from './src/Main'
import { NavigationContainer } from '@react-navigation/native'

// -----
// DO NOT PUT ANY SUBSTANTIAL UI OR LOGIC INTO THIS FILE. ONLY INCLUDE SYSTEM CONFIGURATION.
// -----

NavigationBar.setBackgroundColorAsync('white').catch(console.error)

export default function App(): React.ReactElement<void> {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Main />
    </SafeAreaView>
  )
}
