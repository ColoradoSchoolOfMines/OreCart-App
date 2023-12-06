import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Main from "./src/Main";
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

const queryClient = new QueryClient();

const App: React.FC<void> = () => (
  <QueryClientProvider client={queryClient}>
    <SafeAreaProvider style={LayoutStyle.fill}>
      <Main style={LayoutStyle.fill} />
    </SafeAreaProvider>
  </QueryClientProvider>
);

export default App;
