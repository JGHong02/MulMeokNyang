// FC, Dispatch, SetStateAction Type
import type { FC, Dispatch, SetStateAction } from "react";
// Context
import { UserContext } from "../../contexts/UserContext";
// Hook
import { useCallback, useContext } from "react";
// Custom Hook
import { useGoRoute } from "../../hooks/useGoScreen";
// Platform, StyleSheet, Component
import { Platform, StyleSheet } from "react-native";
import { TouchableOpacity, Image, Text } from "react-native";
// API
import { quickSignUp } from "../../api/start/quickSignUp";
// signUpLogo Image
import { signUpLogoImgPath } from "../../../assets/registLogo/signUpLogoImgPath";

type SignUpButtonProps = {
  method: string;
  bgColor: string;
  setAlertRoute?: Dispatch<SetStateAction<string>>;
  setOnAlert?: Dispatch<SetStateAction<boolean>>;
};

const SignUpButton: FC<SignUpButtonProps> = ({
  method,
  bgColor,
  setAlertRoute = () => {},
  setOnAlert = () => {},
}) => {
  // 간편 로그인, 간편 회원가입 이후 전역 변수 값을 바꿀 setter 함수 불러오기
  const { setUserEmailGV, setManagementSpaceIdGV } = useContext(UserContext);

  // 간편 로그인인지 간편 회원가입인지 또는 Local SignUp인지에 따라 다르게 화면 이동
  const goBasicForm = useGoRoute("BasicForm");
  const goUserProfileRegistration = useGoRoute("UserProfileRegistration");

  // Local SignUp 버튼을 눌렀다면, BasicForm 화면으로 이동
  const onLocalSignUpPressHandler = useCallback(() => {
    goBasicForm();
  }, []);

  const onQuickSignUpPressHandler = useCallback(async () => {
    // Quick SignUp 버튼을 누른 경우 API를 호출하여 간편 로그인 혹은 간편 회원가입을 진행
    try {
      const res = await quickSignUp(method);
      // userEmail 값 전역 변수에 저장하여, 로그인 상태 유지
      setUserEmailGV(res.userEmail);

      // 다음 두 경우는 바로 UserProfileRegistation 화면으로 이동한다.
      // 1. registSuccess 값이 있으면 간편 로그인이 아닌 간편 회원가입인 경우
      // 2. 간편 로그인이지만 아직 사용자 프로필 등록을 마치지 않아 userNickname 값이 없는 경우
      if (
        res.hasOwnProperty("registSuccess") ||
        (res.hasOwnProperty("userNickname") && !res.userNickname)
      ) {
        goUserProfileRegistration();
        return;
      }

      // userNicknmae 값이 설정되어 있다면, 자동 로그인을 원하는지 Alert 띄우기
      // 이 때 Alert는 Start 화면에서 띄우는 것.
      // managementSpaceId 값이 있다면 전역변수로 저장하고
      // 값이 있냐 없냐에 따라 Alert에서 화면 다르게 이동
      if (res.managementSpaceId) {
        setManagementSpaceIdGV(res.managementSpaceId);
        // 값이 있다면 alert route를 Main 화면으로 설정
        setAlertRoute("Main");
      } else {
        // 값이 없다면 alert route를 HowToGoSpace 화면으로 설정
        setAlertRoute("HowToGoSpace");
      }
      setOnAlert(true);
    } catch (error) {
      throw error;
    }
  }, []);

  return (
    <TouchableOpacity
      style={[
        styles.buttonView,
        Platform.OS === "android" ? styles.shadowAndroid : styles.shadowIOS,
        { backgroundColor: bgColor },
      ]}
      onPress={
        method !== "Local"
          ? onQuickSignUpPressHandler
          : onLocalSignUpPressHandler
      }>
      {method !== "Local" ? (
        <>
          <Image
            source={signUpLogoImgPath[method]}
            style={[styles.logoImage]}
          />
          <Text style={[styles.Text]}>{method}로 시작하기</Text>
        </>
      ) : (
        <>
          <Text style={[styles.Text]}>이메일로 회원가입</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default SignUpButton;

const styles = StyleSheet.create({
  buttonView: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 320,
    height: 50,
    borderRadius: 10,
  },
  shadowAndroid: {
    elevation: 4,
  },
  shadowIOS: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  logoImage: {
    position: "absolute",
    left: 20,
    width: 20,
    height: 20,
    marginRight: 20,
  },
  Text: { fontSize: 15, color: "rgba(0, 0, 0, 0.7)" },
});
