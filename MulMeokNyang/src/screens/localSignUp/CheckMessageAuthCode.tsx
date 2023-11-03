// Context
import { UserContext } from "../../contexts/UserContext";
// Hook
import { useState, useContext, useCallback } from "react";
// StyleSheet, Component
import { StyleSheet } from "react-native";
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
import { localSignUp } from "../../api/localSignUp/localSignUp";
// styles
import formStyles from "../../styles/formStyles";
import alertBackgroundStyles from "../../styles/alertBackgroundStyles";

const CheckMessageAuthCode = () => {
  // authCode와 valid가 담긴 state
  const [formInfo, setFormInfo] = useState<CheckMessageAuthCodeFormType>(
    initialCheckMessageAuthCodeForm
  );

  // Alert 관련 state
  const [authSuccess, setAuthSuccess] = useState<boolean>(false);
  const [signUpSuccess, setSignUpSuccess] = useState<boolean>(false);

  // Alert 관련 property state
  const [onAlert, setOnAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertCloseRoute, setAlertCloseRoute] = useState<string>("");

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

  const completeButtonPressHandler = useCallback(async () => {
    // -----------------------checkMessageAuthCode API 호출----------------------------
    // try {
    //   authSuccess = await checkMessageAuthCode(
    //     userPhoneNumGV,
    //     formInfo.authCode
    //   );
    // } catch (error) {
    //   throw error;
    // }

    // #######################API 연결 후 아래 코드 삭제########################
    // setAuthSuccess(true);
    if (!authSuccess) {
      // Alert Component property 값 바꾸기
      setAlertMsg("인증번호가\n일치하지 않습니다.");
      // Alert Component 보여주기
      setOnAlert(true);
      return;
    }

    // 문자 인증을 통과했다면
    // ------------------------localSignUp API 호출---------------------------
    // try {
    //   signUpSuccess = await localSignUp(
    //     userEmailGV,
    //     userPwGV,
    //     userNameGV,
    //     userPhoneNumGV
    //   );
    // } catch (error) {
    //   throw error;
    // }

    // #######################API 연결 후 아래 코드 삭제########################
    setSignUpSuccess(true);
    if (signUpSuccess) {
      // user table에 전역변수에 저장된 회원가입 정보 초기화
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
    <SafeAreaView style={[styles.safeAreaView]}>
      <View>
        <TopBar title="회원가입" />
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
          {/* 나중에 아래 Text들 지워야 돼 */}
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

const styles = StyleSheet.create({
  safeAreaView: {
    position: "relative",
  },
});
