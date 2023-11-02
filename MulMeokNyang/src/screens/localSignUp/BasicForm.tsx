// Context
import { UserContext } from "../../contexts/UserContext";
// Hook
import { useState, useContext, useCallback } from "react";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { SafeAreaView, View, Text } from "react-native";
// Custom Component
import TopBar from "../../components/TopBar";
import InputContainer from "../../components/InputContainer";
import ProcessButton from "../../components/ProcessButton";
// State Type
import {
  LocalSignUpFormType,
  initialLocalSignUpForm,
} from "../../data/localSignUpFormType";
// utils
import {
  checkEmailAvailable,
  checkPw,
  checkPwConfirm,
} from "../../utils/checkValid";
import { checkCanPress } from "../../utils/checkCanPress";

const BasicForm = () => {
  // userEmail, userPw, userPwConfirm, 각각의 valid 값이 담긴 state
  const [formInfo, setFormInfo] = useState<LocalSignUpFormType>(
    initialLocalSignUpForm
  );

  // 전역변수 값을 바꿀 setter함수 불러오기
  const { setUserEmailGV, setUserPwGV } = useContext(UserContext);

  // ProcessButton의 onPress 이벤트 핸들러 함수
  const next = useCallback(() => {
    // 회원가입 '완료' 버튼을 눌러, user table에 값을 저장하기 전까지 필요한 값들 전역변수로 저장
    setUserEmailGV(formInfo.userEmail);
    setUserPwGV(formInfo.userPw);
  }, [formInfo]);

  return (
    <SafeAreaView>
      <TopBar title="회원가입" />
      <View style={[styles.formView]}>
        <InputContainer
          value={formInfo.userEmail}
          setValue={setFormInfo}
          prop="userEmail"
          title="이메일"
          checkValue={checkEmailAvailable}
        />
        <InputContainer
          value={formInfo.userPw}
          setValue={setFormInfo}
          prop="userPw"
          title="비밀번호"
          isSecret
          checkValue={checkPw}
        />
        <InputContainer
          value={formInfo.userPwConfirm}
          setValue={setFormInfo}
          prop="userPwConfirm"
          title="비밀번호 확인"
          isSecret
          compareValue={formInfo.userPw}
          checkValue={checkPwConfirm}
        />
        <ProcessButton
          content="다음"
          canPress={checkCanPress(formInfo.valid)}
          onPressHandler={next}
          route="RequestMessageAuth"
        />
      </View>
    </SafeAreaView>
  );
};

export default BasicForm;

const styles = StyleSheet.create({
  formView: { alignItems: "center", marginTop: 30 },
});
