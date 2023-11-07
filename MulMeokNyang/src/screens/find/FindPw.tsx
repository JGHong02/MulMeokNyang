// Context
import { UserContext } from "../../contexts/UserContext";
// Hook
import { useCallback, useState, useContext } from "react";
// Component
import { SafeAreaView, View } from "react-native";
// Custom Component
import TopBar from "../../components/TopBar";
import InputContainer from "../../components/inputContainer/InputContainer";
import ProcessButton from "../../components/button/ProcessButton";
import Alert from "../../components/alert/Alert";
// State Type
import {
  FindPwFormType,
  initialFindPwForm,
} from "../../data/find/findPwFormType";
// utils
import { checkEmail, checkPhoneNum } from "../../utils/checkValid";
import { checkCanPress } from "../../utils/checkCanPress";
// API
import { checkUserExists } from "../../api/find/checkUserExists";
import { messageAuth } from "../../api/common/messageAuth";
// styles
import mainViewStyles from "../../styles/mainViewStyles";
import alertBackgroundStyles from "../../styles/alertBackgroundStyles";

const FindPw = () => {
  // userEmail, userPhoneNum, 각각의 valid 값이 담긴 state
  const [formInfo, setFormInfo] = useState<FindPwFormType>(initialFindPwForm);

  // userPhoneNum setter 함수 불러오기
  const { setUserEmailGV, setUserPhoneNumGV } = useContext(UserContext);

  // Alert 관련 property state
  const [onAlert, setOnAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] =
    useState<string>("해당되는 사용자가\n없습니다.");

  const authButtonPressHandler = useCallback(async () => {
    // -------------------checkUserExists API 호출---------------------
    try {
      const userExists = await checkUserExists(
        formInfo.userEmail,
        formInfo.userPhoneNum
      );
      if (!userExists) {
        setOnAlert(true);
        return;
      }
    } catch (error) {
      throw error;
    }

    // -------------------messageAuth API 호출-----------------------
    try {
      await messageAuth(formInfo.userPhoneNum);
    } catch (error) {
      throw error;
    }
    // 전역 변수 저장
    setUserEmailGV(formInfo.userEmail);
    setUserPhoneNumGV(formInfo.userPhoneNum);
  }, [formInfo, setOnAlert]);

  return (
    <SafeAreaView>
      <View>
        <TopBar title="비밀번호 찾기" />
        <View style={[mainViewStyles.mainView]}>
          <InputContainer
            value={formInfo.userEmail}
            setValue={setFormInfo}
            prop="userEmail"
            title="이메일"
            placeholder="이메일 형식에 맞게 입력해주세요"
            checkValue={checkEmail}
            noResultMsg
          />
          <InputContainer
            value={formInfo.userPhoneNum}
            setValue={setFormInfo}
            prop="userPhoneNum"
            title="전화번호"
            placeholder="010-XXXX-XXXX"
            checkValue={checkPhoneNum}
            noResultMsg
          />
          <ProcessButton
            content="문자인증하기"
            canPress={checkCanPress(formInfo.valid)}
            onPressHandler={authButtonPressHandler}
            route="CheckMessageAuthCodeInFP"
          />
        </View>
      </View>
      {onAlert && (
        <View style={[alertBackgroundStyles.alertBackgroundView]}>
          <Alert msg={alertMsg} setOnAlert={setOnAlert} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default FindPw;
