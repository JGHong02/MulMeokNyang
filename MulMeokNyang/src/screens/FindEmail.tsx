import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView, View } from "react-native";
import TopBar from "../components/TopBar";
import InputContainer from "../components/InputContainer";
import Button from "../components/Button";
import {
  findEmailFormType,
  initialFindEmailForm,
} from "../data/findEmailFormType";
import { checkCanPress } from "../utils/checkCanPress";

const FindEmail = () => {
  const [findEmailFormInfo, setFindEmailFormInfo] =
    useState<findEmailFormType>(initialFindEmailForm);

  return (
    <SafeAreaView>
      <TopBar title="이메일 찾기" />
      <View style={[styles.formView]}>
        <InputContainer
          value={findEmailFormInfo.userName}
          setValue={setFindEmailFormInfo}
          prop="userName"
          title="이름"
        />
        <InputContainer
          value={findEmailFormInfo.userPhoneNum}
          setValue={setFindEmailFormInfo}
          prop="userPhoneNum"
          title="전화번호"
          placeholder="010-XXXX-XXXX"
        />
        <Button
          content="이메일 찾기"
          route="Start"
          canPress={checkCanPress(findEmailFormInfo.valid)}
        />
      </View>
    </SafeAreaView>
  );
};

export default FindEmail;

const styles = StyleSheet.create({
  formView: { alignItems: "center", marginTop: 30 },
});
