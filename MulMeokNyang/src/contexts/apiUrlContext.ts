import { createContext } from "react";

// API 호출 엔드포인트 URLContext 생성
type APIURLContextType = {
  apiUrl: string;
};
const defaultAPIURLContext = {
  apiUrl: "",
};
export const APIURLContext =
  createContext<APIURLContextType>(defaultAPIURLContext);
