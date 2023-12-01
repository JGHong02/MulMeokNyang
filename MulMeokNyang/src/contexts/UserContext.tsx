import { useState, createContext, ReactNode } from "react";

// Context Type
type UserContextType = {
  // GV : Global Variable
  isMainDataChanged: number; // Main화면으로 돌아왔을 때 Main에 필요한 데이터가 바뀐 경우에만 리렌더링, 바뀔 때마다 증가됨
  userEmailGV: string;
  managementSpaceIdGV: string;
  // 아래 세 변수는 회원가입, 이메일 찾기, 비밀번호 찾기 때만 사용됨
  userPwGV: string;
  userNameGV: string;
  userPhoneNumGV: string;
  // 증가 함수
  indicateMainDataChanged: () => void;
  // setter 함수
  setUserEmailGV: (email: string) => void;
  setManagementSpaceIdGV: (id: string) => void;
  setUserPwGV: (pw: string) => void;
  setUserNameGV: (name: string) => void;
  setUserPhoneNumGV: (phoneNum: string) => void;
};

// Default Context
const defaultUserContext = {
  // GV
  isMainDataChanged: 0,
  userEmailGV: "",
  managementSpaceIdGV: "",
  userPwGV: "",
  userNameGV: "",
  userPhoneNumGV: "",
  // 증가 함수
  indicateMainDataChanged: () => {},
  // setter 함수
  // default는 보통 () => {}로 함
  setUserEmailGV: () => {},
  setManagementSpaceIdGV: () => {},
  setUserPwGV: () => {},
  setUserNameGV: () => {},
  setUserPhoneNumGV: () => {},
};

// UserContext 생성
export const UserContext = createContext<UserContextType>(defaultUserContext);

// Provider Props
// React 18 버전부터 더 이상 children을 제공하지 않기 때문에
// 직접 cildren의 타입을 지정하고 전달해 주어야 합니다.
interface ProviderProps {
  children: ReactNode;
}

export const UserContextProvider = ({ children }: ProviderProps) => {
  const [isMainDataChanged, setIsMainDataChanged] = useState<number>(0);
  const [userEmailGV, setUserEmailGV] = useState<string>("");
  const [managementSpaceIdGV, setManagementSpaceIdGV] = useState<string>("");
  const [userPwGV, setUserPwGV] = useState<string>("");
  const [userNameGV, setUserNameGV] = useState<string>("");
  const [userPhoneNumGV, setUserPhoneNumGV] = useState<string>("");

  const indicateMainDataChanged = () => {
    setIsMainDataChanged((prev) => prev + 1);
  };

  return (
    <UserContext.Provider
      value={{
        isMainDataChanged,
        indicateMainDataChanged,
        userEmailGV,
        setUserEmailGV,
        managementSpaceIdGV,
        setManagementSpaceIdGV,
        userPwGV,
        setUserPwGV,
        userNameGV,
        setUserNameGV,
        userPhoneNumGV,
        setUserPhoneNumGV,
      }}>
      {children}
    </UserContext.Provider>
  );
};
