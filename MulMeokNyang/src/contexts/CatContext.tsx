import { useState, createContext, ReactNode } from "react";

// Context Type
type CatContextType = {
  // GV : Global Variable
  catIdArrGV: string[];
  catProfilePhotoUrlArrGV: string[];
  // setter 함수
  setCatIdArrGV: (idArr: string[]) => void;
  setCatProfilePhotoUrlArrGV: (photoUrlArr: string[]) => void;
};

// Default Context
const defaultCatContext = {
  // GV
  catIdArrGV: [],
  catProfilePhotoUrlArrGV: [],
  // setter 함수
  setCatIdArrGV: () => {},
  setCatProfilePhotoUrlArrGV: () => {},
};

// CatContext 생성
export const CatContext = createContext<CatContextType>(defaultCatContext);

// Provider Props
// React 18 버전부터 더 이상 children을 제공하지 않기 때문에
// 직접 cildren의 타입을 지정하고 전달해 주어야 합니다.
interface ProviderProps {
  children: ReactNode;
}

export const CatContextProvider = ({ children }: ProviderProps) => {
  const [catIdArrGV, setCatIdArrGV] = useState<string[]>([]);
  const [catProfilePhotoUrlArrGV, setCatProfilePhotoUrlArrGV] = useState<
    string[]
  >([]);

  return (
    <CatContext.Provider
      value={{
        catIdArrGV,
        setCatIdArrGV,
        catProfilePhotoUrlArrGV,
        setCatProfilePhotoUrlArrGV,
      }}>
      {children}
    </CatContext.Provider>
  );
};
