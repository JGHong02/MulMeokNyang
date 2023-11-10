// FC Type
import type { FC } from "react";
// Custom Hook
import { useGoRouteWithParams } from "../../../hooks/useGoScreen";
// Custom Component
import CatPhotosForAISet from "./CatPhotosForAISet";

type CatPhotosForAIRegistrationType = {
  route: any;
};

const CatPhotosForAIRegistration: FC<CatPhotosForAIRegistrationType> = ({
  route,
}) => {
  const { method } = route.params;
  // 화면 이동 함수 선언
  const goCatFeedStuffRegistration = useGoRouteWithParams(
    "CatFeedStuffRegistration",
    "method",
    method
  );

  return <CatPhotosForAISet goAfterRotue={goCatFeedStuffRegistration} />;
};

export default CatPhotosForAIRegistration;
