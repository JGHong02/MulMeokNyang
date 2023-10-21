import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView, View, Text } from "react-native";
import TopBar from "../components/TopBar";
import InputContainer from "../components/InputContainer";
import Button from "../components/Button";
import {
  localRegistFormType,
  initialLocalRegistForm,
} from "../data/localRegistFormType";

const LocalRegist = () => {
  const [localRegistFormInfo, setLocalRegistFormInfo] =
    useState<localRegistFormType>(initialLocalRegistForm);

  return (
    <SafeAreaView>
      <TopBar title="회원가입" />
      <View style={[styles.formView]}>
        <InputContainer
          value={localRegistFormInfo.userEmail}
          setValue={setLocalRegistFormInfo}
          prop="userEmail"
          title="이메일"
        />
        <InputContainer
          value={localRegistFormInfo.userPw}
          setValue={setLocalRegistFormInfo}
          prop="userPw"
          title="비밀번호"
          isSecret
        />
        <InputContainer
          value={localRegistFormInfo.userPwConfirm}
          setValue={setLocalRegistFormInfo}
          prop="userPwConfirm"
          title="비밀번호 확인"
          isSecret
          compareValue={localRegistFormInfo.userPw}
        />
        <Button content="본인인증하기" />
      </View>
    </SafeAreaView>
  );
};

export default LocalRegist;

const styles = StyleSheet.create({
  formView: { alignItems: "center", marginTop: 30 },
});
