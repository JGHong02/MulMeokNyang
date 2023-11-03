// Context
import { UserContext } from "../../contexts/UserContext";
// Hook
import { useState, useContext, useCallback } from "react";
// StyleSheet, Component
import { SafeAreaView, View, Text } from "react-native";
// Custom Component
import TopBar from "../../components/TopBar";
import InputContainer from "../../components/InputContainer";
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
import { sendPw } from "../../api/find/sendPw";
// styles
import formStyles from "../../styles/formStyles";
import alertBackgroundStyles from "../../styles/alertBackgroundStyles";

const CheckMessageAuthCode = () => {
  // authCode와 valid가 담긴 state
  const [formInfo, setFormInfo] = useState<CheckMessageAuthCodeFormType>(
    initialCheckMessageAuthCodeForm
  );

  // 전역 변수와 setter 함수 불러오기
  const { userEmailGV, userPhoneNumGV, setUserEmailGV, setUserPhoneNumGV } =
    useContext(UserContext);

  // Alert 관련 state
  const [authSuccess, setAuthSuccess] = useState<boolean>(false);
  const [sendPwSuccess, setSendPwSuccess] = useState<boolean>(false);

  // Alert 관련 property state
  const [onAlert, setOnAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertCloseRoute, setAlertCloseRoute] = useState<string>("");

  const completeButtonPressHandler = useCallback(async () => {
    // -----------------------checkMessageAuthCode API 호출----------------------------
    try {
      const authSuccess = await checkMessageAuthCode(
        userPhoneNumGV,
        formInfo.authCode
      );
      setAuthSuccess(authSuccess);
    } catch (error) {
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
    // ------------------------sendPW API 호출---------------------------
    try {
      await sendPw(userEmailGV);
    } catch (error) {
      throw error;
    }

    setSendPwSuccess(true);
    // user table에 전역변수에 저장된 비밀번호 찾기 정보 초기화
    setUserEmailGV("");
    setUserPhoneNumGV("");

    // Alert Component property 값 바꾸기
    setAlertMsg("입력하신 이메일로\n비밀번호가 전송되었습니다!");
    setAlertCloseRoute("Login");
    // Alert Component 보여주기
    setOnAlert(true);
  }, [
    formInfo,
    authSuccess,
    setAuthSuccess,
    setSendPwSuccess,
    setOnAlert,
    setAlertMsg,
    setAlertCloseRoute,
  ]);

  return (
    <SafeAreaView>
      <View>
        <TopBar title="비밀번호 찾기" />
        <View style={[formStyles.formView]}>
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
        </View>
        {/* ################전역 변수 저장 확인############### */}
        <Text>{userEmailGV}</Text>
        <Text>{userPhoneNumGV}</Text>
      </View>
      {onAlert && (
        <View style={[alertBackgroundStyles.alertBackgroundView]}>
          <Alert
            msg={alertMsg}
            closeRoute={sendPwSuccess ? alertCloseRoute : ""}
            setOnAlert={!sendPwSuccess ? setOnAlert : () => {}}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default CheckMessageAuthCode;
