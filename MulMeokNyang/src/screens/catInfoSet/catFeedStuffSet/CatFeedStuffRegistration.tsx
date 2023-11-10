// FC Type
import type { FC } from "react";
// Custom Hook
import { useGoRouteWithParams } from "../../../hooks/useGoScreen";
// Custom Component
import CatFeedStuffSet from "./CatFeedStuffSet";

type CatFeedStuffRegistrationType = {
  route: any;
};

const CatFeedStuffRegistration: FC<CatFeedStuffRegistrationType> = ({
  route,
}) => {
  const { method } = route.params;
  // 화면 이동 함수 선언
  const goCatHydrationRegistration = useGoRouteWithParams(
    "CatHydrationRegistration",
    "method",
    method
  );

  return (
    <CatFeedStuffSet
      method={method}
      goAfterRoute={goCatHydrationRegistration}
    />
  );
};

export default CatFeedStuffRegistration;
