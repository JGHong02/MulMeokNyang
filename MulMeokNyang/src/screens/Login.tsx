// Hook
import { useState } from "react";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { SafeAreaView, View, Text } from "react-native";
// Custom Component
import TopBar from "../components/TopBar";
import InputContainer from "../components/InputContainer";
import AutoLoginCheckBox from "../components/AutoLoginCheckBox";
import ProcessButton from "../components/button/ProcessButton";
import UnderlineTextButton from "../components/button/UnderlineTextButton";
// State Type
import { LoginFormType, initialLoginForm } from "../data/login/loginFormType";
// utils
import { checkEmpty } from "../utils/checkValid";
import { checkCanPress } from "../utils/checkCanPress";
// styles
import formStyles from "../styles/formStyles";

const Login = () => {
  // userEmail, userPw, 각각의 valid 값이 담긴 state
  const [formInfo, setFormInfo] = useState<LoginFormType>(initialLoginForm);
  // 자동로그인 체크박스 체크 여부
  const [check, setCheck] = useState<boolean>(true);

  return (
    <SafeAreaView style={[styles.safeAreaView]}>
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
          onPressHandler={() => {}}
        />
      </View>
      <View style={[styles.underlineTextButtonView]}>
        <UnderlineTextButton text="이메일 찾기" route="FindEmail" />
        <View style={[styles.line]} />
        <UnderlineTextButton text="비밀번호 찾기" route="FindPw" />
        <View style={[styles.line]} />
        <UnderlineTextButton text="회원가입" route="BasicForm" />
      </View>
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
