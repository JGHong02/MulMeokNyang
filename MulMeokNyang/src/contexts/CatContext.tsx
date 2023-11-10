import { useState, createContext, ReactNode } from "react";

// Context Type
type CatContextType = {
  // GV : Global Variable
  catIdArrGV: string[];
  catProfilePhotoArrGV: string[];
  currentSelectedCatIdGV: string;
  // setter 함수
  setCatIdArrGV: (idArr: string[]) => void;
  setCatProfilePhotoArrGV: (photoArr: string[]) => void;
  setCurrentSelectedCatIdGV: (id: string) => void;
};

// Default Context
const defaultCatContext = {
  // GV
  catIdArrGV: [],
  catProfilePhotoArrGV: [],
  currentSelectedCatIdGV: "",
  // setter 함수
  setCatIdArrGV: () => {},
  setCatProfilePhotoArrGV: () => {},
  setCurrentSelectedCatIdGV: () => {},
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
  const [catProfilePhotoArrGV, setCatProfilePhotoArrGV] = useState<string[]>(
    []
  );
  const [currentSelectedCatIdGV, setCurrentSelectedCatIdGV] =
    useState<string>("");

  return (
    <CatContext.Provider
      value={{
        catIdArrGV,
        setCatIdArrGV,
        catProfilePhotoArrGV,
        setCatProfilePhotoArrGV,
        currentSelectedCatIdGV,
        setCurrentSelectedCatIdGV,
      }}>
      {children}
    </CatContext.Provider>
  );
};
