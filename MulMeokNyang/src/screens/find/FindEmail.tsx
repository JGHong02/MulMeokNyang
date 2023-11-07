// Context
import { UserContext } from "../../contexts/UserContext";
// Hook
import { useCallback, useContext, useState } from "react";
// Custom Hook
import useGoRoute from "../../hooks/useGoRoute";
// Component
import { SafeAreaView, View } from "react-native";
// Custom Component
import TopBar from "../../components/TopBar";
import InputContainer from "../../components/inputContainer/InputContainer";
import ProcessButton from "../../components/button/ProcessButton";
import Alert from "../../components/alert/Alert";
// State Type
import {
  FindEmailFormType,
  initialFindEmailForm,
} from "../../data/find/findEmailFormType";
// utils
import { checkEmpty, checkPhoneNum } from "../../utils/checkValid";
import { checkCanPress } from "../../utils/checkCanPress";
// API
import { getFindEmail } from "../../api/find/getFindEmail";
// styles
import mainViewStyles from "../../styles/mainViewStyles";
import alertBackgroundStyles from "../../styles/alertBackgroundStyles";

const FindEmail = () => {
  // userName, userPhoneNum, 각각의 valid 값이 담긴 state
  const [formInfo, setFormInfo] =
    useState<FindEmailFormType>(initialFindEmailForm);

  // 전역변수 값을 바꿀 setter 함수 불러오기
  const { setUserEmailGV } = useContext(UserContext);

  // findEmailResult 화면으로 이동
  const goFindEmailResult = useGoRoute("FindEmailResult");

  // Alert 관련 property state
  const [onAlert, setOnAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] =
    useState<string>("해당되는 사용자가\n없습니다.");

  const findEmailButtonPressHandler = useCallback(async () => {
    try {
      // ------------------getFindEmail API 호출------------------------
      const userEmail = await getFindEmail(
        formInfo.userName,
        formInfo.userPhoneNum
      );

      // userEmail 값이 있다면
      if (userEmail) {
        // findEmailResult 화면에서 보여주기 위해 전역 변수에 저장
        setUserEmailGV(userEmail);
        // FindEmailResult 화면으로 이동
        goFindEmailResult();
        return;
      }

      // userEmail 값이 없다면 Alert 보여주기
      setOnAlert(true);
    } catch (error) {
      throw error;
    }
  }, [formInfo, setOnAlert]);

  return (
    <SafeAreaView>
      <View>
        <TopBar title="이메일 찾기" />
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
            content="이메일 찾기"
            canPress={checkCanPress(formInfo.valid)}
            onPressHandler={findEmailButtonPressHandler}
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

export default FindEmail;
