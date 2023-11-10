// FC Type
import type { FC } from "react";
// Custom Hook
import { useGoBack } from "../../../hooks/useGoScreen";
// Custom Component
import CatFeedStuffSet from "./CatFeedStuffSet";

type CatFeedStuffModificationType = {
  route: any;
};

const CatFeedStuffModification: FC<CatFeedStuffModificationType> = ({
  route,
}) => {
  const { catId } = route.params;
  // 화면 이동 함수 선언
  const goBack = useGoBack();

  return <CatFeedStuffSet method="수정" catId={catId} goAfterRoute={goBack} />;
};

export default CatFeedStuffModification;
