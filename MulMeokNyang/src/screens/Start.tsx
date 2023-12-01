// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
// Context
import { UserContext } from "../contexts/UserContext";
// Hook
import { useEffect, useContext, useState, useCallback } from "react";
// Custom Hook
import { useGoRoute } from "../hooks/useGoScreen";
import useLoading from "../hooks/useLoading";
// Dimension, StyleSheet, Component
import { Dimensions, StyleSheet } from "react-native";
import {
  SafeAreaView,
  View,
  Image,
  Text,
  ActivityIndicator,
} from "react-native";
// Custom Component
import SignUpButton from "../components/button/SignUpButton";
import UnderlineTextButton from "../components/button/UnderlineTextButton";
import Alert from "../components/alert/Alert";
// API
import { setAutoLogin, getAutoLoginInfo } from "../api/common/autoLogin";
// styles
// import alertBackgroundStyles from "../styles/alertBackgroundStyles";

// 물먹냥 로고
const { width } = Dimensions.get("window");
const logo = require("../../assets/MulMeokNyang_logo.png");
const desiredLogoWidth = width * 0.8;

const Start = () => {
  // 자동로그인 혹은 자동로그인 설정 시 사용할 전역변수와 setter 함수 불러오기
  const { userEmailGV, setUserEmailGV, setManagementSpaceIdGV } =
    useContext(UserContext);

  // 자동로그인이 설정된 사용자는 적절히 화면 이동
  const goMain = useGoRoute("Main");
  const goHowToGoSpace = useGoRoute("HowToGoSpace");

  // 로딩 표시
  const { isLoading, handleLoading } = useLoading();

  // mount 할 때, AsyncStorage에 sessionID 토큰(자동 로그인용)이 저장되어 있는지 확인
  // 존재한다면, 자동 로그인 함수 호출
  useEffect(() => {
    const autoLogin = async (sessionID: string) => {
      try {
        // -------------------------getAutoLoginInfo API 호출----------------------
        const res = await getAutoLoginInfo(sessionID);
        const { userEmail, managementSpaceId } = res;
        setUserEmailGV(userEmail);
        setManagementSpaceIdGV(managementSpaceId);

        handleLoading(false);

        // managementSpaceId 값이 null이 아니라면 (관리 스페이스가 설정된 사용자)
        if (managementSpaceId) {
          // 바로 Main 화면으로 이동
          goMain();
          return;
        }
        goHowToGoSpace();
      } catch (error: any) {
        console.log(
          "Start 화면 getAutoLoginInfo 호출에서 error 발생 :",
          error.message
        );
        throw error;
      }
    };

    const checkAutoLogin = async () => {
      try {
        // await AsyncStorage.clear();
        const sessionID = await AsyncStorage.getItem("sessionID");
        if (sessionID) {
          console.log("세션 스토리지에 저장된 sessionID :", sessionID);

          handleLoading(true);
          autoLogin(sessionID);
        }
      } catch (error: any) {
        console.log(
          "Start 화면 AsyncStorage.getItem에서 error 발생 :",
          error.message
        );
        throw error;
      }
    };
    // useEffect에서는 async, await를 콜백함수에 직접 사용할 수 없고
    // 콜백 함수 내에서 async 함수를 선언하고 호출하는 방식으로 사용해야 함
    checkAutoLogin();
  }, []);

  // Quick Sign Up 기능 뺌
  // ------------ Quick Sign Up 관련 ---------------
  // // Alert 관련 property state
  // const [onAlert, setOnAlert] = useState<boolean>(false);
  // const [alertMsg, setAlertMsg] =
  //   useState<string>("자동 로그인을\n설정하시겠습니까?");
  // const [alertRoute, setAlertRoute] = useState<string>("Login"); // Login은 확인용

  // // 자동 로그인 설정 Alert에서 '예' 버튼을 누를 경우
  // const alertButtonPressHandler = useCallback(async () => {
  //   try {
  //     // ------------------setAutoLogin API 호출-----------------------
  //     const res = await setAutoLogin(userEmailGV);
  //     const sessionID = res.sessionID;
  //     // 서버에서 생성된 sessionID를 클라이언트의 AsyncStorage에 sessionID로 저장
  //     await AsyncStorage.setItem("sessionID", sessionID);
  //     // ################sessionID 저장됐나 확인용####################
  //     const savedSessionID = await AsyncStorage.getItem("sessionID");
  //     console.log(savedSessionID);
  //   } catch (error: any) {
  //     console.log(
  //       "Start 화면 alertButtonPressHandler 이벤트 핸들러 함수의 setAutoLogin 호출에서 error 발생 :",
  //       error.message
  //     );
  //     throw error;
  //   }
  // }, []);

  return (
    <SafeAreaView style={[styles.safeAreaView]}>
      <View style={[styles.mainView]}>
        <Image source={logo} style={[styles.logoImage]} />
        {isLoading ? (
          <ActivityIndicator size="large" color="#59a0ff" />
        ) : (
          <>
            <View style={[styles.buttonListView]}>
              {/* ------------ Quick Sign Up 관련 --------------- */}
              {/* <SignUpButton
                method="Naver"
                bgColor="#1DC800"
                setAlertRoute={setAlertRoute}
                setOnAlert={setOnAlert}
              />
              <SignUpButton
                method="Kakao"
                bgColor="#FEE500"
                setAlertRoute={setAlertRoute}
                setOnAlert={setOnAlert}
              />
              <SignUpButton
                method="Google"
                bgColor="#ECECEC"
                setAlertRoute={setAlertRoute}
                setOnAlert={setOnAlert}
              /> */}
              <SignUpButton method="Local" bgColor="white" />
            </View>
            <View style={[styles.textButtonView]}>
              <Text style={[styles.text]}>이미 가입 하셨나요?</Text>
              <UnderlineTextButton text="로그인" route="Login" />
            </View>
          </>
        )}
      </View>
      {/* ------------ Quick Sign Up 관련 --------------- */}
      {/* {onAlert && (
        <View style={[alertBackgroundStyles.alertBackgroundView]}>
          <Alert
            msg={alertMsg}
            closeRoute={alertRoute}
            isButton
            buttonContent="예"
            buttonRoute={alertRoute}
            buttonPressHandler={alertButtonPressHandler}
          />
        </View>
      )} */}
    </SafeAreaView>
  );
};

export default Start;

const styles = StyleSheet.create({
  safeAreaView: {
    position: "relative",
    alignItems: "center",
  },
  logoImage: {
    width: desiredLogoWidth,
    height: 250,
    resizeMode: "contain",
    marginTop: 170,
  },
  mainView: {
    alignItems: "center",
  },
  buttonListView: { justifyContent: "space-around", margin: 30 },
  textButtonView: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginRight: 10,
  },
});
