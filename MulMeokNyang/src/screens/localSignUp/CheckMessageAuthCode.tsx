// Context
import { UserContext } from "../../contexts/UserContext";
// Hook
import { useState, useContext, useCallback } from "react";
// Component
import { SafeAreaView, View, Text } from "react-native";
// Custom Component
import TopBar from "../../components/TopBar";
import InputContainer from "../../components/inputContainer/InputContainer";
import ProcessButton from "../../components/button/ProcessButton";
import Alert from "../../components/alert/Alert";
// State Type
import {
  CheckMessageAuthCodeFormType,
  initialCheckMessageAuthCodeForm,
} from "../../data/common/checkMessageAuthCodeFormType";
// utils
import { checkEmpty } from "../../utils/checkValid";
import { checkCanPress } from "../../utils/checkCanPress";
// API
import { checkMessageAuthCode } from "../../api/common/checkMessageAuthCode";
import { localSignUp } from "../../api/localSignUp/localSignUp";
// styles
import mainViewStyles from "../../styles/mainViewStyles";
import alertBackgroundStyles from "../../styles/alertBackgroundStyles";

const CheckMessageAuthCode = () => {
  // authCode와 valid가 담긴 state
  const [formInfo, setFormInfo] = useState<CheckMessageAuthCodeFormType>(
    initialCheckMessageAuthCodeForm
  );

  // 전역 변수와 setter 함수 불러오기
  const {
    userEmailGV,
    userPwGV,
    userNameGV,
    userPhoneNumGV,
    setUserEmailGV,
    setUserPwGV,
    setUserNameGV,
    setUserPhoneNumGV,
  } = useContext(UserContext);

  // Alert 관련 state
  const [authSuccess, setAuthSuccess] = useState<boolean>(false);
  const [signUpSuccess, setSignUpSuccess] = useState<boolean>(false);

  // Alert 관련 property state
  const [onAlert, setOnAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertCloseRoute, setAlertCloseRoute] = useState<string>("");

  // '완료' ProcessButton의 onPress 이벤트 핸들러 함수
  const completeButtonPressHandler = useCallback(async () => {
    // -----------------------checkMessageAuthCode API 호출----------------------------
    try {
      const authSuccess = await checkMessageAuthCode(
        userPhoneNumGV,
        formInfo.authCode
      );
      setAuthSuccess(authSuccess);
    } catch (error: any) {
      console.log(
        "localSignUp/CheckMessageAuthCode 화면 completeButtonPressHandler 이벤트 핸들러 함수의 checkMessageAuthCode 호출에서 error 발생 :",
        error.message
      );
      throw error;
    }

    if (!authSuccess) {
      // Alert Component property 값 바꾸기
      setAlertMsg("인증번호가\n일치하지 않습니다.");
      // Alert Component 보여주기
      setOnAlert(true);
      return;
    }

    // 문자 인증을 통과했다면
    // ------------------------localSignUp API 호출---------------------------
    try {
      const signUpSuccess = await localSignUp(
        userEmailGV,
        userPwGV,
        userNameGV,
        userPhoneNumGV
      );
      setSignUpSuccess(signUpSuccess);
    } catch (error: any) {
      console.log(
        "localSignUp/CheckMessageAuthCode 화면 completeButtonPressHandler 이벤트 핸들러 함수의 localSignUp 호출에서 error 발생 :",
        error.message
      );
      throw error;
    }

    if (signUpSuccess) {
      // 회원가입 전역변수 초기화
      setUserEmailGV("");
      setUserPwGV("");
      setUserNameGV("");
      setUserPhoneNumGV("");

      // Alert Component property 값 바꾸기
      setAlertMsg("회원가입이\n완료되었습니다!");
      setAlertCloseRoute("Login");
      // Alert Component 보여주기
      setOnAlert(true);
    }
  }, [
    formInfo,
    authSuccess,
    setAuthSuccess,
    signUpSuccess,
    setSignUpSuccess,
    setOnAlert,
    setAlertMsg,
    setAlertCloseRoute,
  ]);

  return (
    <SafeAreaView>
      <View>
        <TopBar title="회원가입" />
        <View style={[mainViewStyles.mainView]}>
          <InputContainer
            value={formInfo.authCode}
            setValue={setFormInfo}
            prop="authCode"
            title="인증번호"
            checkValue={checkEmpty}
          />
          <ProcessButton
            content="완료"
            canPress={checkCanPress(formInfo.valid)}
            onPressHandler={completeButtonPressHandler}
          />
          {/* ################전역 변수 저장 확인############### */}
          <Text>{userEmailGV}</Text>
          <Text>{userPwGV}</Text>
          <Text>{userNameGV}</Text>
          <Text>{userPhoneNumGV}</Text>
        </View>
      </View>
      {onAlert && (
        <View style={[alertBackgroundStyles.alertBackgroundView]}>
          <Alert
            msg={alertMsg}
            closeRoute={signUpSuccess ? alertCloseRoute : ""}
            setOnAlert={!signUpSuccess ? setOnAlert : () => {}}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default CheckMessageAuthCode;