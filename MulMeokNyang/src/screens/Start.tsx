import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext } from "react";
import { UserGVContext } from "../contexts/userGVContext";
import { autoLogin } from "../api/autoLogin";
import useGoRoute from "../hooks/useGoRoute";
import { Dimensions, StyleSheet } from "react-native";
import { SafeAreaView, View, Image, Text } from "react-native";
import RegistButton from "../components/RegistButton";
import UnderlineTextButton from "../components/UnderlineTextButton";

// 함수 선언과 동시에 즉시 호출을 하기 위해,
// (() => {})(); 형태의 익명 함수 호출 및 선언 방법 사용
(async () => {
  try {
    // AsyncStorage에 sessionID가 저장되어 있는지 확인
    // sessionID가 있다는 것은, 자동 로그인이 설정된 사용자임을 의미
    const sessionID = await AsyncStorage.getItem("sessionID");
    if (sessionID) {
      // 있다면 sessionID로 autoLogin API 호출
      // return 값인 userEmail, managementSpaceId를 구조분해 할당 후
      const [userEmail, managementSpaceId] = await autoLogin(sessionID);
      const { setUserEmailGV } = useContext(UserGVContext);
      // userEmail 값 먼저 전역 변수에 대입
      setUserEmailGV(userEmail);

      // managementSpaceId 값도 있다면 (userEmail은 전제 조건으로 당연히 있음)
      if (managementSpaceId) {
        // managementSpaceIdGV 전역 변수의 setter 함수도 useContext로 가져오기
        const { setManagementSpaceIdGV } = useContext(UserGVContext);
        // 전역 변수에 대입
        setManagementSpaceIdGV(managementSpaceId);
        // managementSpaceId 값이 있다는 뜻은, 소속된 관리 스페이스가 있다는 뜻이므로
        // 바로 관리 스페이스 화면인 Main 화면으로 이동
        useGoRoute("Main");
        return;
      }
      // uerEmail 값만 있었다면, 관리 스페이스 생성 첫 화면인 HowToGoSpace 화면으로 이동
      useGoRoute("HowToGoSpace");
      return;
    }
  } catch (error) {
    throw error;
  }
})();

const logo = require("../../assets/MulMeokNyang_logo.png");
const { width } = Dimensions.get("window");
const desiredLogoWidth = width * 0.8;

const Start = () => {
  return (
    <SafeAreaView style={[styles.safeAreaView]}>
      <Image source={logo} style={[styles.logoImage]} />
      <View style={[styles.buttonListView]}>
        <RegistButton method="Naver" />
        <RegistButton method="Kakao" />
        <RegistButton method="Google" />
        <RegistButton method="LocalRegist" />
      </View>
      <View style={[styles.textListView]}>
        <Text style={[styles.text]}>이미 가입 하셨나요?</Text>
        <UnderlineTextButton text="로그인" route="Login" />
      </View>
    </SafeAreaView>
  );
};

export default Start;

const styles = StyleSheet.create({
  safeAreaView: { flex: 1, alignItems: "center" },
  logoImage: { flex: 4, width: desiredLogoWidth, resizeMode: "contain" },
  buttonListView: { flex: 3, justifyContent: "space-around" },
  textListView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginRight: 10,
  },
});
