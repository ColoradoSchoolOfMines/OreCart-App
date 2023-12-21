import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

import Main from "./app/Main";
import store from "./app/store";
import Color from "./common/style/color";
import LayoutStyle from "./common/style/layout";

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
