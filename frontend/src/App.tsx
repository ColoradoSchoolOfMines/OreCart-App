import * as NavigationBar from "expo-navigation-bar";
import { Platform, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Main from "./app/Main";
import store from "./app/store";
import { ParamListBase } from "./common/navTypes";
import Color from "./common/style/color";
import LayoutStyle from "./common/style/layout";
import { ADARequest } from "./features/screens/ADARequest";
import { Alerts } from "./features/screens/Alerts";
import { BugReport } from "./features/screens/BugReport";
import { Settings } from "./features/screens/Settings";

// -----
// DO NOT PUT ANY SUBSTANTIAL UI OR LOGIC INTO THIS FILE. ONLY INCLUDE SYSTEM CONFIGURATION.
// -----

if (Platform.OS === "android") {
  NavigationBar.setBackgroundColorAsync(Color.generic.white).catch(
    console.error,
  );
}

const Stack = createNativeStackNavigator<ParamListBase>();

const App: React.FC<void> = () => (
  <Provider store={store}>
    <SafeAreaProvider style={LayoutStyle.fill}>
      <View style={LayoutStyle.fill}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={Main} options={{ headerShown: false }} />
            <Stack.Screen name="Alerts" component={Alerts} />
            <Stack.Screen name="ADARequest" component={ADARequest} />
            <Stack.Screen name="BugReport" component={BugReport} />
            <Stack.Screen name="Settings" component={Settings} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  </Provider>
);

export default App;
