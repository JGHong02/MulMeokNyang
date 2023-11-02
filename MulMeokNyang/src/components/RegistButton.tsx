// 많은 수정 요망 ^^
import { useCallback, useContext } from "react";
import { UserGVContext } from "../contexts/UserContext";
import { quickSignUp } from "../api/quickSignUp";
import useGoRoute from "../hooks/useGoRoute";
import type { FC } from "react";
// prettier-ignore
import { Platform, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { registLogoImgPath } from "../../assets/registLogo/registLogoImgPath";

type RegistButtonProps = {
  method: string;
  bgColor: string;
};

const RegistButton: FC<RegistButtonProps> = ({ method, bgColor }) => {
  const onPressHandler = useCallback(async () => {
    try {
      const resData = await quickSignUp(method);
      const { setUserEmailGV } = useContext(UserGVContext);
      setUserEmailGV(resData.userEmail);

      // quickSignUp API의 Case 2. 간편 회원가입
      if (resData.hasOwnProperty("registSucess")) {
        useGoRoute("UserProfileRegistration");
        return;
      }

      // Case 1. 간편 로그인
      // managementSpaceId 값이 null이 아니라면, 소속된 관리 스페이스가 있다는 뜻
      if (resData.managementSpaceId) {
        const { setManagementSpaceIdGV } = useContext(UserGVContext);
        setManagementSpaceIdGV(resData.managementSpaceId);
        useGoRoute("Main");
        return;
      }

      // managementSpaceId 값이 null이지만, userNickname 값은 null이 아니라면,
      // 사용자 프로필 등록을 마친 사용자로, 자동 로그인 설정 Alert Component를 띄운다.
      if (resData.userNickname) {
        // Start Component에서 onAutoLoginAlert state와 setter 설정해서 여기로 전달해야 할 듯.
        // 그리고 onAutoLoginAlert가 true가 되면, Start에서는 state 값이 바뀜을 인지하고
        // Alert Component를 Start 화면에서 띄우는거야.
      }
    } catch (error) {
      throw error;
    }
  }, []);

  return (
    <TouchableOpacity
      style={[
        styles.buttonView,
        Platform.OS === "android" ? styles.shadowAndroid : styles.shadowIOS,
        { backgroundColor: bgColor },
      ]}>
      {method !== "LocalRegist" ? (
        <>
          <Image
            source={registLogoImgPath[method]}
            style={[styles.logoImage]}
          />
          <Text style={[styles.Text]}>{method}로 시작하기</Text>
        </>
      ) : (
        <>
          <Text style={[styles.Text]}>이메일로 회원가입</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default RegistButton;

const styles = StyleSheet.create({
  buttonView: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 320,
    height: 50,
    borderRadius: 10,
  },
  shadowAndroid: {
    elevation: 4,
  },
  shadowIOS: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  logoImage: {
    position: "absolute",
    left: 20,
    width: 20,
    height: 20,
    marginRight: 20,
  },
  Text: { fontSize: 15, color: "rgba(0, 0, 0, 0.7)" },
});
