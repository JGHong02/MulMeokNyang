// Hook
import { useState } from "react";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { SafeAreaView, View } from "react-native";
// Custom Component
import TopBar from "../../components/TopBar";
import InputContainer from "../../components/InputContainer";
import Button from "../../components/Button";
// State Type
import {
  FindEmailFormType,
  initialFindEmailForm,
} from "../../data/find/findEmailFormType";
// utils
import { checkEmpty, checkPhoneNum } from "../../utils/checkValid";
import { checkCanPress } from "../../utils/checkCanPress";
// styles
import formStyles from "../../styles/formStyles";

const FindEmail = () => {
  const [formInfo, setFormInfo] =
    useState<FindEmailFormType>(initialFindEmailForm);

  return (
    <SafeAreaView>
      <TopBar title="이메일 찾기" />
      <View style={[formStyles.formView]}>
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
