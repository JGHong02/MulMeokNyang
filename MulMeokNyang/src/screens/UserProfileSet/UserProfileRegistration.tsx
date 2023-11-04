// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
// Context
import { UserContext } from "../../contexts/UserContext";
// Hook
import { useCallback, useContext } from "react";
// Custom Component
import UserProfileSet from "./UserProfileSet";
// API
import { setAutoLogin } from "../../api/common/autoLogin";

const UserProfileRegistration = () => {
  // 전역변수 불러오기
  const { userEmailGV } = useContext(UserContext);

  // 사용자 프로필을 '첫 등록'한 사용자에게 자동 로그인 Alert 띄우기
  const alertButtonPressHandeler = useCallback(async () => {
    try {
      const res = await setAutoLogin(userEmailGV);
      await AsyncStorage.setItem("sessionID", res.sessionID);
      // ################sessionID 저장됐나 확인용####################
      const savedSessionID = await AsyncStorage.getItem("sessionID");
      console.log(savedSessionID);
    } catch (error) {
      console.error(
        "UserProfileRegistration의 alertButtonPressHandeler에서 에러 발생:",
        error
      );
      throw error;
    }
  }, []);

  return (
    <>
      <UserProfileSet
        method="등록"
        alertButtonPressHandeler={alertButtonPressHandeler}
      />
    </>
  );
};

export default UserProfileRegistration;
