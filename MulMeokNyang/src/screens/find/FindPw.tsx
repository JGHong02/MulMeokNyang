import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView, View } from "react-native";
import TopBar from "../../components/TopBar";
import InputContainer from "../../components/InputContainer";
import Button from "../../components/Button";
import { FindPwFormType, initialFindPwForm } from "../../data/findPwFormType";
import { checkEmail } from "../../utils/checkValid";
import { checkCanPress } from "../../utils/checkCanPress";

const FindPw = () => {
  const [formInfo, setFormInfo] = useState<FindPwFormType>(initialFindPwForm);

  return (
    <SafeAreaView>
      <TopBar title="비밀번호 찾기" />
      <View style={[styles.formView]}>
        <InputContainer
          value={formInfo.userEmail}
          setValue={setFormInfo}
          prop="userEmail"
          title="이메일"
          placeholder="이메일 형식에 맞게 입력해주세요"
          checkValue={checkEmail}
          noResultMsg
        />
        <Button
          content="본인인증하기"
          route="Start"
          canPress={checkCanPress(formInfo.valid)}
        />
      </View>
    </SafeAreaView>
  );
};

export default FindPw;

const styles = StyleSheet.create({
  formView: { alignItems: "center", marginTop: 30 },
});
