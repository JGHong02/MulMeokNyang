// FC Type
import type { FC } from "react";
// Custom Hook
import { useGoRoute, useGoRouteWithParams } from "../../../hooks/useGoScreen";
// Custom Component
import CatHydrationSet from "./CatHydrationSet";

type CatHydrationRegistrationType = {
  route: any;
};

const CatHydrationRegistration: FC<CatHydrationRegistrationType> = ({
  route,
}) => {
  const { method } = route.params;

  // '추가 등록' 버튼 화면 이동 함수 선언
  const goCatProfileRegistration = useGoRouteWithParams(
    "CatProfileRegistration",
    "method",
    "추가 등록"
  );

  // '등록 완료' 버튼 화면 이동 함수 선언
  const goMain = useGoRoute("Main");

  return (
    <CatHydrationSet
      method={method}
      goAdditionalRegistRoute={goCatProfileRegistration}
      goFinishRegistRoute={goMain}
    />
  );
};

export default CatHydrationRegistration;
