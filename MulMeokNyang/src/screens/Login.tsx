import React, { useState } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import TopBar from "../components/TopBar";
import InputContainer from "../components/Input";
import Button from "../components/Button";
import UnderlineTextButton from "../components/UnderlineTextButton";

const Login = () => {
  // userEmail, userPw 바뀌는 거 확인 함
  const [userEmail, setUserEmail] = useState<string>("");
  const [userPw, setUserPw] = useState<string>("");

  return (
    <SafeAreaView style={[styles.safeAreaView]}>
      <TopBar back drawer={false} title="로그인" />
      <View style={[styles.formView]}>
        <InputContainer
          value={userEmail}
          setInput={setUserEmail}
          title="이메일"
          logColor="green"
        />
        <InputContainer
          value={userPw}
          setInput={setUserPw}
          title="비밀번호"
          logColor="red"
        />
        <Button content="로그인" route="Start" />
      </View>
      <View style={[styles.underlineTextButtonView]}>
        <UnderlineTextButton text="이메일 찾기" route="" />
        <View style={[styles.line]} />
        <UnderlineTextButton text="비밀번호 찾기" route="" />
        <View style={[styles.line]} />
        <UnderlineTextButton text="회원가입" route="" />
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
