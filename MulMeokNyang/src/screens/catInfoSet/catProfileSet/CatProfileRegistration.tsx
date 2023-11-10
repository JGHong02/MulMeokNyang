// FC Type
import type { FC } from "react";
// Custom Hook
import { useGoRouteWithParams } from "../../../hooks/useGoScreen";
// Custom Component
import CatProfileSet from "./CatProfileSet";

type CatProfileRegistrationType = {
  route: any;
};

const CatProfileRegistration: FC<CatProfileRegistrationType> = ({ route }) => {
  const { method } = route.params;
  // 화면 이동 함수 선언
  const goCatPhotosForAIRegistration = useGoRouteWithParams(
    "CatPhotosForAIRegistration",
    "method",
    method
  );

  return (
    <CatProfileSet
      method={method}
      goAfterRoute={goCatPhotosForAIRegistration}
    />
  );
};

export default CatProfileRegistration;
