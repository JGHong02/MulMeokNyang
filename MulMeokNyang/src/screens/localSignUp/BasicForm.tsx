// Context
import { UserContext } from "../../contexts/UserContext";
// Hook
import { useState, useContext, useCallback } from "react";
// Component
import { SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// Custom Component
import TopBar from "../../components/TopBar";
import InputContainer from "../../components/inputContainer/InputContainer";
import ProcessButton from "../../components/button/ProcessButton";
// State Type
import {
  LocalSignUpFormType,
  initialLocalSignUpForm,
} from "../../data/localSignUp/localSignUpFormType";
// utils
import {
  // checkEmailAvailable,
  checkEmail,
  checkPw,
  checkPwConfirm,
} from "../../utils/checkValid";
import { checkCanPress } from "../../utils/checkCanPress";
// styles
import mainViewStyles from "../../styles/mainViewStyles";

const BasicForm = () => {
  // userEmail, userPw, userPwConfirm, 각각의 valid 값이 담긴 state
  const [formInfo, setFormInfo] = useState<LocalSignUpFormType>(
    initialLocalSignUpForm
  );

  // 전역변수 값을 바꿀 setter함수 불러오기
  const { setUserEmailGV, setUserPwGV } = useContext(UserContext);

  // '다음' ProcessButton의 onPress 이벤트 핸들러 함수
  const nextButtonPressHandler = useCallback(() => {
    // 회원가입 '완료' 버튼을 눌러, user table에 값을 저장하기 전까지 필요한 값들 전역변수로 저장
    setUserEmailGV(formInfo.userEmail);
    setUserPwGV(formInfo.userPw);
  }, [formInfo]);

  return (
    <SafeAreaView>
      <TopBar title="회원가입" />
      <KeyboardAwareScrollView contentContainerStyle={mainViewStyles.mainView}>
        <InputContainer
          value={formInfo.userEmail}
          setValue={setFormInfo}
          prop="userEmail"
          title="이메일"
          // checkValue={checkEmailAvailable}
          checkValue={checkEmail}
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
          onPressHandler={nextButtonPressHandler}
          route="RequestMessageAuth"
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default BasicForm;
