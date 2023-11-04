// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";
// Context
import { UserContext } from "../contexts/UserContext";
// Hook
import { useCallback, useContext, useState } from "react";
// Custom Hook
import useGoRoute from "../hooks/useGoRoute";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { SafeAreaView, View } from "react-native";
// Custom Component
import TopBar from "../components/TopBar";
import InputContainer from "../components/InputContainer";
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
import formStyles from "../styles/formStyles";
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

  const loginButtonPressHandler = useCallback(async () => {
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
      if (!res.userNickname) {
        setAlertMsg("자동 로그인은\n프로필 등록을 마친 다음\n설정 가능합니다.");
        setOnAlert(true);
        setAlertCloseRoute("UserProfileRegistration");
        return;
      }

      // 자동로그인를 체크한 사용자
      // 이 경우에만 sessionID property가 전달됨
      if (res.hasOwnProperty("sessionID")) {
        await AsyncStorage.setItem("sessionID", res.sessionID);
        // ################sessionID 저장됐나 확인용####################
        const savedSessionID = await AsyncStorage.getItem("sessionID");
        console.log(savedSessionID);
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
    } catch (error) {
      throw error;
    }
  }, [formInfo, setOnAlert, setAlertMsg, setAlertCloseRoute]);

  return (
    <SafeAreaView style={[styles.safeAreaView]}>
      <View>
        <TopBar title="로그인" />
        <View style={[formStyles.formView]}>
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
        </View>
        <View style={[styles.underlineTextButtonView]}>
          <UnderlineTextButton text="이메일 찾기" route="FindEmail" />
          <View style={[styles.line]} />
          <UnderlineTextButton text="비밀번호 찾기" route="FindPw" />
          <View style={[styles.line]} />
          <UnderlineTextButton text="회원가입" route="BasicForm" />
        </View>
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
  safeAreaView: { flex: 1 },
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
});
