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
import ProcessButton from "../../components/ProcessButton";
// State Type
import {
  CheckMessageAuthCodeFormType,
  initialCheckMessageAuthCodeForm,
} from "../../data/checkMessageAuthCodeFormType";
// utils
import { checkEmpty } from "../../utils/checkValid";
import { checkCanPress } from "../../utils/checkCanPress";
// API
import { checkMessageAuthCode } from "../../api/checkMessageAuthCode";
import { localSignUp } from "../../api/localSignUp";

const CheckMessageAuthCode = () => {
  // authCode와 valid가 담긴 state
  const [formInfo, setFormInfo] = useState<CheckMessageAuthCodeFormType>(
    initialCheckMessageAuthCodeForm
  );
  const [onAlert, setOnAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [route, setRoute] = useState<string>("");

  // 전역변수 값을 바꿀 setter 함수 불러오기
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

  const complete = useCallback(async () => {
    // -----------------------checkMessageAuthCode API 호출----------------------------
    let authSuccess = false;
    // try {
    //   authSuccess = await checkMessageAuthCode(
    //     userPhoneNumGV,
    //     formInfo.authCode
    //   );
    // } catch (error) {
    //   throw error;
    // }

    // #######################API 연결 후 아래 코드 삭제########################
    authSuccess = true;
    if (!authSuccess) {
      // Alert Component property 값 바꾸기
      setAlertMsg("인증번호가 일치하지 않습니다.");
      // Alert Component 보여주기
      setOnAlert(true);
      return;
    }

    // 문자 인증을 통과했다면
    // ------------------------localSignUp API 호출---------------------------
    let signUpSuccess = false;
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
    signUpSuccess = true;
    if (signUpSuccess) {
      // user table에 전역변수에 저장된 회원가입 정보 초기화
      setUserEmailGV("");
      setUserPwGV("");
      setUserNameGV("");
      setUserPhoneNumGV("");

      // Alert Component property 값 바꾸기
      setAlertMsg("회원가입이 완료되었습니다!");
      setRoute("Login");
      // Alert Component 보여주기
      setOnAlert(true);
    }
  }, [formInfo, setOnAlert, setAlertMsg, setRoute]);

  return (
    <SafeAreaView>
      <TopBar title="회원가입" />
      <View style={[styles.formView]}>
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
          onPressHandler={complete}
        />
        {/* 나중에 아래 Text들 지워야 돼 */}
        <Text>{userEmailGV}</Text>
        <Text>{userPwGV}</Text>
        <Text>{userNameGV}</Text>
        <Text>{userPhoneNumGV}</Text>
      </View>
    </SafeAreaView>
  );
};

export default CheckMessageAuthCode;

const styles = StyleSheet.create({
  formView: { alignItems: "center", marginTop: 30 },
});
