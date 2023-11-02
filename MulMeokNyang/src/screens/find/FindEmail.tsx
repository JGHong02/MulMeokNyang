import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView, View } from "react-native";
import TopBar from "../../components/TopBar";
import InputContainer from "../../components/InputContainer";
import Button from "../../components/Button";
import {
  FindEmailFormType,
  initialFindEmailForm,
} from "../../data/findEmailFormType";
import { checkEmpty, checkPhoneNum } from "../../utils/checkValid";
import { checkCanPress } from "../../utils/checkCanPress";

const FindEmail = () => {
  const [formInfo, setFormInfo] =
    useState<FindEmailFormType>(initialFindEmailForm);

  return (
    <SafeAreaView>
      <TopBar title="이메일 찾기" />
      <View style={[styles.formView]}>
        <InputContainer
          value={formInfo.userName}
          setValue={setFormInfo}
          prop="userName"
          title="이름"
          checkValue={checkEmpty}
        />
        <InputContainer
          value={formInfo.userPhoneNum}
          setValue={setFormInfo}
          prop="userPhoneNum"
          title="전화번호"
          placeholder="010-XXXX-XXXX"
          checkValue={checkPhoneNum}
        />
        <Button
          content="이메일 찾기"
          route="Start"
          canPress={checkCanPress(formInfo.valid)}
        />
      </View>
    </SafeAreaView>
  );
};

export default FindEmail;

const styles = StyleSheet.create({
  formView: { alignItems: "center", marginTop: 30 },
});
