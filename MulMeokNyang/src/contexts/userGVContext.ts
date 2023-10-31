import { createContext } from "react";

// UserGVContext 생성
// GV : Global Variable
type UserGVContextType = {
  userEmailGV: string;
  managementSpaceIdGV: string;
  catIdArrGV: number[];
  catProfilePhotoArrGV: string[];
  currentSelectedCatIdGV: number;
  // setter 함수
  setUserEmailGV: (email: string) => void;
  setManagementSpaceIdGV: (id: string) => void;
  setCatIdArrGV: (idArr: number[]) => void;
  setCatProfilePhotoArrGV: (photoArr: string[]) => void;
  setCurrentSelectedCatIdGV: (id: number) => void;
};
const defaultUserGVContext = {
  userEmailGV: "",
  managementSpaceIdGV: "",
  catIdArrGV: [],
  catProfilePhotoArrGV: [],
  currentSelectedCatIdGV: 1,
  // setter 함수
  setUserEmailGV: () => {},
  setManagementSpaceIdGV: () => {},
  setCatIdArrGV: () => {},
  setCatProfilePhotoArrGV: () => {},
  setCurrentSelectedCatIdGV: () => {},
};
export const UserGVContext =
  createContext<UserGVContextType>(defaultUserGVContext);
