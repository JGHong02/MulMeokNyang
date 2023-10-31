import React, { useState } from "react";
import { UserGVContext } from "./src/contexts/userGVContext";
import "react-native-gesture-handler";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./src/navigation/MainNavigator";

enableScreens();

const App = () => {
  // 전역 변수로 관리할 상태 값 및 setter 함수 정의
  const [userEmailGV, setUserEmailGV] = useState<string>("");
  const [managementSpaceIdGV, setManagementSpaceIdGV] = useState<string>("");
  const [catIdArrGV, setCatIdArrGV] = useState<number[]>([]);
  const [catProfilePhotoArrGV, setCatProfilePhotoArrGV] = useState<string[]>(
    []
  );
  const [currentSelectedCatIdGV, setCurrentSelectedCatIdGV] =
    useState<number>(1);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <UserGVContext.Provider
          value={{
            userEmailGV,
            setUserEmailGV,
            managementSpaceIdGV,
            setManagementSpaceIdGV,
            catIdArrGV,
            setCatIdArrGV,
            catProfilePhotoArrGV,
            setCatProfilePhotoArrGV,
            currentSelectedCatIdGV,
            setCurrentSelectedCatIdGV,
          }}>
          <MainNavigator />
        </UserGVContext.Provider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
