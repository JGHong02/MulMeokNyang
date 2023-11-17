// FC Type
import type { FC } from "react";
// Custom Hook
import { useGoBack } from "../../../hooks/useGoScreen";
// Custom Component
import CatProfileSet from "./CatProfileSet";

type CatProfileModificationType = {
  route: any;
};

const CatProfileModification: FC<CatProfileModificationType> = ({ route }) => {
  const { catId } = route.params;
  console.log(catId);
  // 화면 이동 함수 선언
  const goBack = useGoBack();

  return <CatProfileSet method="수정" catId={catId} goAfterRoute={goBack} />;
};

export default CatProfileModification;
