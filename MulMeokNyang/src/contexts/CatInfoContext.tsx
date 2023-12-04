// 이 Context는 '수정'이 아닌
// '새로운' 고양이의 정보를 '등록'할 때만 사용
import { useState, createContext, ReactNode } from "react";

// Context Type
type CatInfoContextType = {
  // GV : Global Variable
  catProfilePhotoUrlGV: string;
  catNameGV: string;
  catAgeGV: string;
  catWeightGV: string;
  catBreedGV: string;
  catColorGV: string[];
  isEatingFeedStuffGV: boolean;
  catFeedStuffDailyConsumptionGV: string;
  catFeedStuffMoistureContentGV: string;
  // setter 함수
  setCatProfilePhotoUrlGV: (photoUrl: string) => void;
  setCatNameGV: (name: string) => void;
  setCatAgeGV: (age: string) => void;
  setCatWeightGV: (weight: string) => void;
  setCatBreedGV: (breed: string) => void;
  setCatColorGV: (color: string[]) => void;
  setIsEatingFeedStuffGV: (isEatingFeedStuff: boolean) => void;
  setCatFeedStuffDailyConsumptionGV: (FSConsumption: string) => void;
  setCatFeedStuffMoistureContentGV: (FSMoisture: string) => void;
};

// Default Context
const defaultCatInfoContext = {
  // GV
  catProfilePhotoUrlGV: "",
  catNameGV: "",
  catAgeGV: "",
  catWeightGV: "",
  catBreedGV: "",
  catColorGV: [],
  isEatingFeedStuffGV: true,
  catFeedStuffDailyConsumptionGV: "",
  catFeedStuffMoistureContentGV: "",
  // setter 함수
  // default는 보통 () => {}로 함
  setCatProfilePhotoUrlGV: () => {},
  setCatNameGV: () => {},
  setCatAgeGV: () => {},
  setCatWeightGV: () => {},
  setCatBreedGV: () => {},
  setCatColorGV: () => {},
  setIsEatingFeedStuffGV: () => {},
  setCatFeedStuffDailyConsumptionGV: () => {},
  setCatFeedStuffMoistureContentGV: () => {},
};

// CatInfoContext 생성
export const CatInfoContext = createContext<CatInfoContextType>(
  defaultCatInfoContext
);

// Provider Props
// React 18 버전부터 더 이상 children을 제공하지 않기 때문에
// 직접 cildren의 타입을 지정하고 전달해 주어야 합니다.
interface ProviderProps {
  children: ReactNode;
}

export const CatInfoContextProvider = ({ children }: ProviderProps) => {
  const [catProfilePhotoUrlGV, setCatProfilePhotoUrlGV] = useState<string>("");
  const [catNameGV, setCatNameGV] = useState<string>("");
  const [catAgeGV, setCatAgeGV] = useState<string>("");
  const [catWeightGV, setCatWeightGV] = useState<string>("");
  const [catBreedGV, setCatBreedGV] = useState<string>("");
  const [catColorGV, setCatColorGV] = useState<string[]>([]);
  const [isEatingFeedStuffGV, setIsEatingFeedStuffGV] =
    useState<boolean>(false);
  const [catFeedStuffDailyConsumptionGV, setCatFeedStuffDailyConsumptionGV] =
    useState<string>("");
  const [catFeedStuffMoistureContentGV, setCatFeedStuffMoistureContentGV] =
    useState<string>("");

  return (
    <CatInfoContext.Provider
      value={{
        catProfilePhotoUrlGV,
        setCatProfilePhotoUrlGV,
        catNameGV,
        setCatNameGV,
        catAgeGV,
        setCatAgeGV,
        catWeightGV,
        setCatWeightGV,
        catBreedGV,
        setCatBreedGV,
        catColorGV,
        setCatColorGV,
        isEatingFeedStuffGV,
        setIsEatingFeedStuffGV,
        catFeedStuffDailyConsumptionGV,
        setCatFeedStuffDailyConsumptionGV,
        catFeedStuffMoistureContentGV,
        setCatFeedStuffMoistureContentGV,
      }}>
      {children}
    </CatInfoContext.Provider>
  );
};
