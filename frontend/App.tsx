import * as NavigationBar from "expo-navigation-bar";
import { SafeAreaView } from "react-native";

import Main from "./src/Main";
import Color from "./src/style/color";
import LayoutStyle from "./src/style/layout";

// -----
// DO NOT PUT ANY SUBSTANTIAL UI OR LOGIC INTO THIS FILE. ONLY INCLUDE SYSTEM CONFIGURATION.
// -----

NavigationBar.setBackgroundColorAsync(Color.generic.white).catch(console.error);

const App: React.FC<void> = () => (
  <SafeAreaView style={LayoutStyle.fill}>
    <Main style={LayoutStyle.fill} />
  </SafeAreaView>
);

export default App;
