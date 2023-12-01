// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
// Context
import { UserContext } from "../contexts/UserContext";
// Hook
import { useCallback, useContext, useState } from "react";
// Custom Hook
import { useGoRoute } from "../hooks/useGoScreen";
import useLoading from "../hooks/useLoading";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { SafeAreaView, View, ActivityIndicator } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// Custom Component
import TopBar from "../components/TopBar";
import InputContainer from "../components/inputContainer/InputContainer";
import AutoLoginCheckBox from "../components/AutoLoginCheckBox";
import ProcessButton from "../components/button/ProcessButton";
import UnderlineTextButton from "../components/button/UnderlineTextButton";
import Alert from "../components/alert/Alert";
// State Type
import { LoginFormType, initialLoginForm } from "../data/login/loginFormType";
// utils
import { checkEmpty } from "../utils/checkValid";
import { checkCanPress } from "../utils/checkCanPress";
// API
import { login } from "../api/login/login";
// styles
import mainViewStyles from "../styles/mainViewStyles";
import alertBackgroundStyles from "../styles/alertBackgroundStyles";

const Login = () => {
  // userEmail, userPw, 각각의 valid 값이 담긴 state
  const [formInfo, setFormInfo] = useState<LoginFormType>(initialLoginForm);

  // 자동로그인 체크박스 체크 여부
  const [check, setCheck] = useState<boolean>(false);

  // 전역변수와 setter 함수 불러오기
  const { setUserEmailGV, setManagementSpaceIdGV } = useContext(UserContext);

  // 로그인 이후 적절히 화면 이동
  const goMain = useGoRoute("Main");
  const goHowToGoSpace = useGoRoute("HowToGoSpace");

  // Alert 관련 property state
  const [onAlert, setOnAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertCloseRoute, setAlertCloseRoute] = useState<string>("");

  // 로딩
  const { isLoading, handleLoading } = useLoading();

  // '로그인' ProcessButton의 onPress 이벤트 핸들러 함수
  const loginButtonPressHandler = useCallback(async () => {
    handleLoading(true);

    try {
      // ----------------------login API 호출---------------------
      const res = await login(formInfo.userEmail, formInfo.userPw, check);
      if (res.hasOwnProperty("userExists")) {
        setAlertMsg("회원가입된\n사용자가 아닙니다.");
        setOnAlert(true);
        return;
      }

      // userEmail 전역 변수로 저장하고 로그인 상태 유지
      setUserEmailGV(res.userEmail);

      // userNickname 값이 없는 사용자는 사용자 프로필 등록을 아직 하지 않은 사용자
      if (res.userNickname === null) {
        setAlertMsg("자동 로그인은\n프로필 등록을 마친 다음\n설정 가능합니다.");
        setAlertCloseRoute("UserProfileRegistration");
        setOnAlert(true);
        return;
      }

      // 자동로그인를 체크한 사용자
      // 이 경우에만 sessionID property가 전달됨
      if (res.hasOwnProperty("sessionID")) {
        await AsyncStorage.setItem("sessionID", res.sessionID);
        // ################sessionID 저장됐나 확인용####################
        const savedSessionID = await AsyncStorage.getItem("sessionID");
        console.log("세션 스토리지에 저장된 savedSessionID :", savedSessionID);
      }

      // managementSpaceId 값이 있는 사용자는 이미 관리 스페이스가 있는 사용자
      if (res.managementSpaceId) {
        // managementSpaceId 전역 변수로 저장
        setManagementSpaceIdGV(res.managementSpaceId);
        // 바로 Main 화면으로 이동
        goMain();
        return;
      }
      // 아직 관리 스페이스가 없는 사용자는 HowToGoSpace 화면으로 이동
      goHowToGoSpace();
    } catch (error: any) {
      console.log(
        "Login 화면 loginButtonPressHandler 이벤트 핸들러 함수의 login 호출에서 error 발생 :",
        error.message
      );
      throw error;
    } finally {
      handleLoading(false);
    }
  }, [formInfo, check]);

  return (
    <SafeAreaView>
      <View>
        <TopBar backRoute="Start" title="로그인" />
        {isLoading ? (
          <View style={[styles.loadingView]}>
            <ActivityIndicator size="large" color="#59a0ff" />
          </View>
        ) : (
          <KeyboardAwareScrollView
            contentContainerStyle={mainViewStyles.mainView}>
            <InputContainer
              value={formInfo.userEmail}
              setValue={setFormInfo}
              prop="userEmail"
              title="이메일"
              checkValue={checkEmpty}
              noResultMsg
            />
            <InputContainer
              value={formInfo.userPw}
              setValue={setFormInfo}
              prop="userPw"
              title="비밀번호"
              isSecret
              checkValue={checkEmpty}
              noResultMsg
            />
            <AutoLoginCheckBox isChecked={check} setCheck={setCheck} />
            <ProcessButton
              content="로그인"
              canPress={checkCanPress(formInfo.valid)}
              onPressHandler={loginButtonPressHandler}
            />
            <View style={[styles.underlineTextButtonView]}>
              <UnderlineTextButton text="이메일 찾기" route="FindEmail" />
              <View style={[styles.line]} />
              <UnderlineTextButton text="비밀번호 찾기" route="FindPw" />
              <View style={[styles.line]} />
              <UnderlineTextButton text="회원가입" route="BasicForm" />
            </View>
          </KeyboardAwareScrollView>
        )}
      </View>
      {onAlert && (
        <View style={[alertBackgroundStyles.alertBackgroundView]}>
          <Alert
            msg={alertMsg}
            closeRoute={alertCloseRoute}
            setOnAlert={alertCloseRoute ? () => {} : setOnAlert}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  underlineTextButtonView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  line: {
    width: 1,
    height: 15,
    backgroundColor: "black",
    marginHorizontal: 15,
  },

  // 로딩
  loadingView: {
    marginTop: 30,
    alignItems: "center",
  },
});
