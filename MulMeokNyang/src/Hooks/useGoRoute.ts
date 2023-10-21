import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";

const useGoRoute = (route: string) => {
  const navigation = useNavigation();
  const goRoute = useCallback(() => {
    navigation.navigate(route);
  }, [route]);
  return goRoute;
};

export default useGoRoute;
