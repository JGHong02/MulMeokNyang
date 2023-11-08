import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";

export const useGoRoute = (route: string) => {
  const navigation = useNavigation();

  const goRoute = useCallback(() => {
    navigation.navigate(route);
  }, [navigation]);

  return goRoute;
};

export const useGoBack = () => {
  const navigation = useNavigation();

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return goBack;
};

export const useGoRouteWithParams = (
  route: string,
  paramName: string,
  paramValue: any
) => {
  const navigation = useNavigation();

  const goRouteWithParams = useCallback(() => {
    navigation.navigate(route, { [paramName]: paramValue });
  }, [navigation]);

  return goRouteWithParams;
};
