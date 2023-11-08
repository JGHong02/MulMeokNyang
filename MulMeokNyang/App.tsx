// Navigation
import "react-native-gesture-handler";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./src/nav/MainNavigator";
// Context Provider
import { UserContextProvider } from "./src/contexts/UserContext";
import { CatInfoContextProvider } from "./src/contexts/CatInfoContext";

enableScreens();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* 아쉬운 점: 특정 화면들만 ContextProvider로 감싸고 싶은데, Navigator를 분리하는 법을 모르겠음 */}
        <UserContextProvider>
          <CatInfoContextProvider>
            <MainNavigator />
          </CatInfoContextProvider>
        </UserContextProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
