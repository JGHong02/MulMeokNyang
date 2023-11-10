// FC Type
import type { FC } from "react";
// Custom Hook
import { useGoBack } from "../../../hooks/useGoScreen";
// Custom Component
import CatHydrationSet from "./CatHydrationSet";

type CatHydrationModificationType = {
  route: any;
};

const CatHydrationModification: FC<CatHydrationModificationType> = ({
  route,
}) => {
  const { catId } = route.params;
  // '화면 이동 함수 선언
  const goBack = useGoBack();

  return (
    <CatHydrationSet method="수정" catId={catId} goAfterModifyRoute={goBack} />
  );
};

export default CatHydrationModification;
