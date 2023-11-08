// FC Type
import type { FC } from "react";
// Custom Component
import CatProfileSet from "./CatProfileSet";

type CatProfileModificationType = {
  route: any;
};

const CatProfileModification: FC<CatProfileModificationType> = ({ route }) => {
  const { catId } = route.params;

  return (
    <>
      <CatProfileSet method="수정" catId={catId} />
    </>
  );
};

export default CatProfileModification;
