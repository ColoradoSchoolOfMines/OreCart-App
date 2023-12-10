import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

import Main from "./src/Main";
import store from "./src/store";
import Color from "./src/style/color";
import LayoutStyle from "./src/style/layout";

// -----
// DO NOT PUT ANY SUBSTANTIAL UI OR LOGIC INTO THIS FILE. ONLY INCLUDE SYSTEM CONFIGURATION.
// -----

if (Platform.OS === "android") {
  NavigationBar.setBackgroundColorAsync(Color.generic.white).catch(
    console.error,
  );
}

const App: React.FC<void> = () => (
  <Provider store={store}>
    <SafeAreaProvider style={LayoutStyle.fill}>
      <Main style={LayoutStyle.fill} />
    </SafeAreaProvider>
  </Provider>
);

export default App;
