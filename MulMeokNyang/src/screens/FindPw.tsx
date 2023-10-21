import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView, View } from "react-native";
import TopBar from "../components/TopBar";
import InputContainer from "../components/InputContainer";
import Button from "../components/Button";
import { findPwFormType, initialFindPwForm } from "../data/findPwFormType";
import { checkCanPress } from "../utils/checkCanPress";

const FindPw = () => {
  const [findPwFormInfo, setFindPwFormInfo] =
    useState<findPwFormType>(initialFindPwForm);

  return (
    <SafeAreaView>
      <TopBar title="비밀번호 찾기" />
      <View style={[styles.formView]}>
        <InputContainer
          value={findPwFormInfo.userEmail}
          setValue={setFindPwFormInfo}
          prop="userEmail"
          title="이메일"
          noResultMsg
          isFindPw
        />
        <Button
          content="본인인증하기"
          route="Start"
          canPress={checkCanPress(findPwFormInfo.valid)}
        />
      </View>
    </SafeAreaView>
  );
};

export default FindPw;

const styles = StyleSheet.create({
  formView: { alignItems: "center", marginTop: 30 },
});
