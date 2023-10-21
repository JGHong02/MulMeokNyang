import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Start from "../screens/Start";
import Login from "../screens/Login";
import LocalRegist from "../screens/LocalRegist";
import FindEmail from "../screens/FindEmail";
import FindPw from "../screens/FindPw";

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Start" component={Start} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="LocalRegist" component={LocalRegist} />
      <Stack.Screen name="FindEmail" component={FindEmail} />
      <Stack.Screen name="FindPw" component={FindPw} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
