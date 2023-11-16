import { useState, createContext, ReactNode } from "react";

// Context Type
type CatContextType = {
  // GV : Global Variable
  catIdArrGV: string[];
  catProfilePhotoUrlArrGV: string[];
  currentSelectedCatIdGV: string;
  // setter 함수
  setCatIdArrGV: (idArr: string[]) => void;
  setCatProfilePhotoUrlArrGV: (photoUrlArr: string[]) => void;
  setCurrentSelectedCatIdGV: (id: string) => void;
};

// Default Context
const defaultCatContext = {
  // GV
  catIdArrGV: [],
  catProfilePhotoUrlArrGV: [],
  currentSelectedCatIdGV: "",
  // setter 함수
  setCatIdArrGV: () => {},
  setCatProfilePhotoUrlArrGV: () => {},
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
  // 임시 데이터
  const [catIdArrGV, setCatIdArrGV] = useState<string[]>([
    "kage",
    "hina",
    "tuki",
    "yama",
    "suga",
    "asa",
    "nishi",
    "tana",
  ]);
  const [catProfilePhotoUrlArrGV, setCatProfilePhotoUrlArrGV] = useState<
    string[]
  >([
    "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540chansolchoi%252Fmulmeoknyang/ImagePicker/00a0b1b7-67e4-49a5-9846-c71ccc0d58bf.jpeg",
    "",
    "",
    "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540chansolchoi%252Fmulmeoknyang/ImagePicker/2f54f402-96b1-41d8-8f93-9eb9bbf5ea6f.jpeg",
    "",
    "",
    "",
    "",
  ]);
  const [currentSelectedCatIdGV, setCurrentSelectedCatIdGV] =
    useState<string>("kage");

  return (
    <CatContext.Provider
      value={{
        catIdArrGV,
        setCatIdArrGV,
        catProfilePhotoUrlArrGV,
        setCatProfilePhotoUrlArrGV,
        currentSelectedCatIdGV,
        setCurrentSelectedCatIdGV,
      }}>
      {children}
    </CatContext.Provider>
  );
};
