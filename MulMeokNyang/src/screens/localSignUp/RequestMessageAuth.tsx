// Context
import { UserContext } from "../../contexts/UserContext";
// Hook
import { useState, useContext, useCallback } from "react";
// Component
import { SafeAreaView, View } from "react-native";
// Custom Component
import TopBar from "../../components/TopBar";
import InputContainer from "../../components/inputContainer/InputContainer";
import ProcessButton from "../../components/button/ProcessButton";
// State Type
import {
  RequestMessageAuthFormType,
  initialRequestMessageAuthForm,
} from "../../data/localSignUp/requestMessageAuthFormType";
// utils
import { checkEmpty, checkPhoneNum } from "../../utils/checkValid";
import { checkCanPress } from "../../utils/checkCanPress";
// API
import { messageAuth } from "../../api/common/messageAuth";
// styles
import mainViewStyles from "../../styles/mainViewStyles";

const RequestMessageAuth = () => {
  // userName, userPhoneNum과 valid가 담긴 state
  const [formInfo, setFormInfo] = useState<RequestMessageAuthFormType>(
    initialRequestMessageAuthForm
  );

  // 전역변수 값을 바꿀 setter함수 불러오기
  const { setUserNameGV, setUserPhoneNumGV } = useContext(UserContext);

  // '문자인증하기' ProcessButton의 onPress 이벤트 핸들러 함수
  const authButtonPressHandler = useCallback(async () => {
    // 회원가입 '완료' 버튼을 눌러, user table에 값을 저장하기 전까지 필요한 값들 전역변수로 저장
    setUserNameGV(formInfo.userName);
    setUserPhoneNumGV(formInfo.userPhoneNum);

    // -------------------messageAuth API 호출-----------------------
    try {
      await messageAuth(formInfo.userPhoneNum);
    } catch (error) {
      throw error;
    }
  }, [formInfo]);

  return (
    <SafeAreaView>
      <TopBar title="회원가입" />
      <View style={[mainViewStyles.mainView]}>
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
        <ProcessButton
          content="문자인증하기"
          canPress={checkCanPress(formInfo.valid)}
          onPressHandler={authButtonPressHandler}
          route="CheckMessageAuthCodeInLS"
        />
      </View>
    </SafeAreaView>
  );
};

export default RequestMessageAuth;
