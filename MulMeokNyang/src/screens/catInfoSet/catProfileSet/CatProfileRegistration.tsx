// FC Type
import type { FC } from "react";
// Custom Component
import CatProfileSet from "./CatProfileSet";

type CatProfileRegistrationType = {
  route: any;
};

const CatProfileRegistration: FC<CatProfileRegistrationType> = ({ route }) => {
  const { method } = route.params;

  return <CatProfileSet method={method} />;
};

export default CatProfileRegistration;
