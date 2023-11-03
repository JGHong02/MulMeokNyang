// Hook
import { useState } from "react";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { SafeAreaView, View } from "react-native";
// Custom Component
import TopBar from "../components/TopBar";
import InputContainer from "../components/InputContainer";
import Button from "../components/Button";
import UnderlineTextButton from "../components/button/UnderlineTextButton";
// State Type
import { LoginFormType, initialLoginForm } from "../data/login/loginFormType";
// utils
import { checkEmail, checkPw } from "../utils/checkValid";
// styles
import formStyles from "../styles/formStyles";

const Login = () => {
  const [formInfo, setFormInfo] = useState<LoginFormType>(initialLoginForm);

  return (
    <SafeAreaView style={[styles.safeAreaView]}>
      <TopBar title="로그인" />
      <View style={[formStyles.formView]}>
        <InputContainer
          value={formInfo.userEmail}
          setValue={setFormInfo}
          prop="userEmail"
          title="이메일"
          checkValue={checkEmail}
          noResultMsg
        />
        <InputContainer
          value={formInfo.userPw}
          setValue={setFormInfo}
          prop="userPw"
          title="비밀번호"
          isSecret
          checkValue={checkPw}
          noResultMsg
        />
        <Button content="로그인" route="Start" canPress />
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
