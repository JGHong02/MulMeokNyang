import React, { useState } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import TopBar from "../components/TopBar";
import InputContainer from "../components/InputContainer";
import Button from "../components/Button";
import UnderlineTextButton from "../components/UnderlineTextButton";
import { loginFormType, initialLoginForm } from "../data/loginFormType";

const Login = () => {
  const [loginFormInfo, setLoginFormInfo] =
    useState<loginFormType>(initialLoginForm);

  return (
    <SafeAreaView style={[styles.safeAreaView]}>
      <TopBar title="로그인" />
      <View style={[styles.formView]}>
        <InputContainer
          value={loginFormInfo.userEmail}
          setValue={setLoginFormInfo}
          prop="userEmail"
          title="이메일"
          noCheckValid
        />
        <InputContainer
          value={loginFormInfo.userPw}
          setValue={setLoginFormInfo}
          prop="userPw"
          title="비밀번호"
          isSecret
          noCheckValid
        />
        <Button content="로그인" route="Start" />
      </View>
      <View style={[styles.underlineTextButtonView]}>
        <UnderlineTextButton text="이메일 찾기" route="FindEmail" />
        <View style={[styles.line]} />
        <UnderlineTextButton text="비밀번호 찾기" route="FindPw" />
        <View style={[styles.line]} />
        <UnderlineTextButton text="회원가입" route="LocalRegist" />
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  safeAreaView: { flex: 1 },
  formView: { alignItems: "center", marginTop: 30 },
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
