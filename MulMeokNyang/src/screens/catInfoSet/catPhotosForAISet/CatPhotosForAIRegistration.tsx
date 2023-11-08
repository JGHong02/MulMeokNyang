// FC Type
import type { FC } from "react";
// Custom Component
import CatPhotosForAISet from "./CatPhotosForAISet";

type CatPhotosForAIRegistrationType = {
  route: any;
};

const CatPhotosForAIRegistration: FC<CatPhotosForAIRegistrationType> = ({
  route,
}) => {
  const { method } = route.params;

  return <CatPhotosForAISet method={method} />;
};

export default CatPhotosForAIRegistration;
