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
  catPhotosUrlforAIGV: string[];
  catFeedStuffDailyConsumptionGV: string;
  catFeedStuffMoistureContentGV: string;
  isHydrationAutoGV: boolean;
  catGoalHydrationGV: string;
  // setter 함수
  setCatProfilePhotoUrlGV: (photoUrl: string) => void;
  setCatNameGV: (name: string) => void;
  setCatAgeGV: (age: string) => void;
  setCatWeightGV: (weight: string) => void;
  setCatPhotosUrlforAIGV: (photosUrlforAI: string[]) => void;
  setCatFeedStuffDailyConsumptionGV: (FSConsumption: string) => void;
  setCatFeedStuffMoistureContentGV: (FSMoisture: string) => void;
  setIsHydrationAutoGV: (isHydrationAuto: boolean) => void;
  setCatGoalHydrationGV: (goalHydration: string) => void;
};

// Default Context
const defaultCatInfoContext = {
  // GV
  catProfilePhotoUrlGV: "",
  catNameGV: "",
  catAgeGV: "",
  catWeightGV: "",
  catPhotosUrlforAIGV: [],
  catFeedStuffDailyConsumptionGV: "",
  catFeedStuffMoistureContentGV: "",
  isHydrationAutoGV: false,
  catGoalHydrationGV: "",
  // setter 함수
  // default는 보통 () => {}로 함
  setCatProfilePhotoUrlGV: () => {},
  setCatNameGV: () => {},
  setCatAgeGV: () => {},
  setCatWeightGV: () => {},
  setCatPhotosUrlforAIGV: () => {},
  setCatFeedStuffDailyConsumptionGV: () => {},
  setCatFeedStuffMoistureContentGV: () => {},
  setIsHydrationAutoGV: () => {},
  setCatGoalHydrationGV: () => {},
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
  const [catPhotosUrlforAIGV, setCatPhotosUrlforAIGV] = useState<string[]>([]);
  const [catFeedStuffDailyConsumptionGV, setCatFeedStuffDailyConsumptionGV] =
    useState<string>("");
  const [catFeedStuffMoistureContentGV, setCatFeedStuffMoistureContentGV] =
    useState<string>("");
  const [isHydrationAutoGV, setIsHydrationAutoGV] = useState<boolean>(false);
  const [catGoalHydrationGV, setCatGoalHydrationGV] = useState<string>("");

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
        catPhotosUrlforAIGV,
        setCatPhotosUrlforAIGV,
        catFeedStuffDailyConsumptionGV,
        setCatFeedStuffDailyConsumptionGV,
        catFeedStuffMoistureContentGV,
        setCatFeedStuffMoistureContentGV,
        isHydrationAutoGV,
        setIsHydrationAutoGV,
        catGoalHydrationGV,
        setCatGoalHydrationGV,
      }}>
      {children}
    </CatInfoContext.Provider>
  );
};
