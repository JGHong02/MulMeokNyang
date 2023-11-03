// Stack Navigator
import { createStackNavigator } from "@react-navigation/stack";
// Route
import Start from "../screens/Start";
import Login from "../screens/Login";
import {
  BasicForm,
  RequestMessageAuth,
  CheckMessageAuthCode,
} from "../screens/localSignUp";
import { FindEmail, FindEmailResult, FindPw } from "../screens/find";

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Start" component={Start} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="BasicForm" component={BasicForm} />
      <Stack.Screen name="RequestMessageAuth" component={RequestMessageAuth} />
      <Stack.Screen
        name="CheckMessageAuthCode"
        component={CheckMessageAuthCode}
      />
      <Stack.Screen name="FindEmail" component={FindEmail} />
      <Stack.Screen name="FindEmailResult" component={FindEmailResult} />
      <Stack.Screen name="FindPw" component={FindPw} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
