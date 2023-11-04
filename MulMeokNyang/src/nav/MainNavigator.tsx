// Stack Navigator
import { createStackNavigator } from "@react-navigation/stack";
// Route
import Start from "../screens/Start";
import Login from "../screens/Login";
import {
  BasicForm,
  RequestMessageAuth,
  CheckMessageAuthCode as CheckMessageAuthCodeInLS,
} from "../screens/localSignUp";
import {
  FindEmail,
  FindEmailResult,
  FindPw,
  CheckMessageAuthCode as CheckMessageAuthCodeInFP,
} from "../screens/find";
import {
  UserProfileRegistration,
  UserProfileModification,
} from "../screens/UserProfileSet";

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      // 화면 확인용
      initialRouteName="UserProfileRegistration">
      <Stack.Screen name="Start" component={Start} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="BasicForm" component={BasicForm} />
      <Stack.Screen name="RequestMessageAuth" component={RequestMessageAuth} />
      <Stack.Screen
        name="CheckMessageAuthCodeInLS"
        component={CheckMessageAuthCodeInLS}
      />
      <Stack.Screen name="FindEmail" component={FindEmail} />
      <Stack.Screen name="FindEmailResult" component={FindEmailResult} />
      <Stack.Screen name="FindPw" component={FindPw} />
      <Stack.Screen
        name="CheckMessageAuthCodeInFP"
        component={CheckMessageAuthCodeInFP}
      />
      <Stack.Screen
        name="UserProfileRegistration"
        component={UserProfileRegistration}
      />
      <Stack.Screen
        name="UserProfileModification"
        component={UserProfileModification}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
