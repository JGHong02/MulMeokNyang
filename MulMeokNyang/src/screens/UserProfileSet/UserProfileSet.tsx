// Context
import { UserContext } from "../../contexts/UserContext";
// FC Type
import type { FC } from "react";
// Hook
import { useState, useEffect, useContext, useCallback } from "react";
// Custom Hook
import { useGoBack } from "../../hooks/useGoScreen";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { SafeAreaView, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// Custom Component
import TopBar from "../../components/TopBar";
import ImageInputContainer from "../../components/inputContainer/ImageInputContainer";
import InputContainer from "../../components/inputContainer/InputContainer";
import ProcessButton from "../../components/button/ProcessButton";
import Alert from "../../components/alert/Alert";
// State Type
import {
  UserProfileFormType,
  initialUserProfileForm,
} from "../../data/userProfileSet/userProfileFormType";
// utils
import { checkEmpty } from "../../utils/checkValid";
import { checkCanPress } from "../../utils/checkCanPress";
// API
import { registUserProfile } from "../../api/userProfileSet/registUserProfile";
import { modifyUserProfile } from "../../api/userProfileSet/modifyUserProfile";
// styles
import mainViewStyles from "../../styles/mainViewStyles";
import alertBackgroundStyles from "../../styles/alertBackgroundStyles";

type UserProfileSetType = {
  method: string;
  // '수정'의 경우, 이전 데이터도 같이 props로 전달됨
  prevUserProfile?: {
    profilePhotoUrl: string;
    nickname: string;
    introduction: string;
  };
  // '등록'의 경우에만 자동 로그인 설정 Alert가 뜨기 때문에
  // Alert Component의 ProcessButton의 onPressHandler가 필요
  alertButtonPressHandeler?: () => void;
};

const UserProfileSet: FC<UserProfileSetType> = ({
  method,
  prevUserProfile = {
    profilePhotoUrl: "",
    nickname: "",
    introduction: "",
  },
  alertButtonPressHandeler = () => {},
}) => {
  // userProfilePhoto, userNickname, userIntroduction과 userNickname의 valid 값이 담긴 state
  const [formInfo, setFormInfo] = useState<UserProfileFormType>(
    initialUserProfileForm
  );

  // API 호출 시 전달할 userEmail 전역변수 불러오기
  const { userEmailGV } = useContext(UserContext);

  // '수정'의 경우, formInfo의 값을 getUserProfile API를 호출하여 새로 할당해야 함.
  useEffect(() => {
    if (method === "등록") return;

    setFormInfo({
      userProfilePhotoUrl: prevUserProfile.profilePhotoUrl,
      userNickname: prevUserProfile.nickname,
      userIntroduction: prevUserProfile.introduction,
      // '수정'의 경우, '등록'을 했을 때 valid가 true여서 DB에 저장된 것이기 때문에
      // 기본 값을 true로 설정하면 됨
      valid: {
        userNickname: true,
      },
    });
  }, []);

  // Alert On 관련 property state
  const [onAlert, setOnAlert] = useState<boolean>(false);
  const [onNicknameAlert, setOnNicknameAlert] = useState<boolean>(false);
  const [onAutoLoginAlert, setOnAutoLoginAlert] = useState<boolean>(false);
  // Alert Msg, Route 관련 property state
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertRoute, setAlertRoute] = useState<string>("");

  // ProcessButton의 onPress 이벤트 핸들러 함수
  // 1. '등록'
  const registButtonPressHandler = useCallback(async () => {
    if (method !== "등록") return;

    try {
      const res = await registUserProfile(
        userEmailGV,
        formInfo.userProfilePhotoUrl,
        formInfo.userNickname,
        formInfo.userIntroduction
      );

      // 중복되는 닉네임인 경우
      if (res.hasOwnProperty("nicknameExists")) {
        setAlertMsg("이미 존재하는\n닉네임입니다.");
        setOnNicknameAlert(true);
        setOnAlert(true);
        return;
      }

      if (res.hasOwnProperty("registSuccess")) {
        setAlertMsg("자동 로그인을\n설정하시겠습니까?");
        setAlertRoute("HowToGoSpace");
        setOnNicknameAlert(false);
        setOnAutoLoginAlert(true);
        setOnAlert(true);
      }
    } catch (error: any) {
      console.log(
        "UserProfileSet 화면 registButtonPressHandler 이벤트 핸들러 함수의 registUserProfile 호출에서 error 발생 :",
        error.message
      );
      throw error;
    }
  }, [
    formInfo,
    setOnAlert,
    setAlertMsg,
    setOnNicknameAlert,
    setOnAutoLoginAlert,
  ]);

  // 2. '수정'
  // '수정' 후 화면 이동할 함수 선언
  const goBack = useGoBack();
  // 이벤트 핸들러 함수
  const modifyButtonPressHandler = useCallback(async () => {
    if (method !== "수정") return;

    try {
      const res = await modifyUserProfile(
        userEmailGV,
        formInfo.userProfilePhotoUrl,
        formInfo.userNickname,
        formInfo.userIntroduction
      );

      // 중복되는 닉네임인 경우
      if (res.hasOwnProperty("nicknameExists")) {
        setAlertMsg("이미 존재하는\n닉네임입니다.");
        setOnNicknameAlert(true);
        setOnAlert(true);
        return;
      }

      if (res.hasOwnProperty("modifySuccess")) {
        goBack();
      }
    } catch (error: any) {
      console.log(
        "UserProfileSet 화면 modifyButtonPressHandler 이벤트 핸들러 함수의 modifyUserProfile 호출에서 error 발생:",
        error.message
      );
      throw error;
    }
  }, [
    formInfo,
    setOnAlert,
    setAlertMsg,
    setOnNicknameAlert,
    setOnAutoLoginAlert,
  ]);

  // #######################################################
  // ####################formInfo 확인용####################
  useEffect(() => {
    console.log(
      "------------------------------------------------------------------------------------------------------------"
    );
    console.log("UserProfileSet 화면의 formInfo를 출력");
    console.log(formInfo);
  }, [formInfo]);

  return (
    <SafeAreaView>
      <TopBar
        back={method === "등록" ? false : true}
        title={`프로필 ${method}`}
      />
      <KeyboardAwareScrollView contentContainerStyle={mainViewStyles.mainView}>
        <ImageInputContainer
          method="사람"
          photoUrl={formInfo.userProfilePhotoUrl}
          setPhotoUrl={setFormInfo}
          prop="userProfilePhotoUrl"
        />
        <InputContainer
          value={formInfo.userNickname}
          setValue={setFormInfo}
          prop="userNickname"
          title="닉네임"
          checkValue={checkEmpty}
          noResultMsg
        />
        <InputContainer
          value={formInfo.userIntroduction}
          setValue={setFormInfo}
          prop="userIntroduction"
          title="자기소개 (선택)"
          optional
          checkValue={checkEmpty}
          noResultMsg
        />
        <View style={[styles.buttonView]}>
          <ProcessButton
            content={method}
            canPress={checkCanPress(formInfo.valid)}
            onPressHandler={
              method === "등록"
                ? registButtonPressHandler
                : modifyButtonPressHandler
            }
          />
        </View>
      </KeyboardAwareScrollView>
      {onAlert && (
        <View style={[alertBackgroundStyles.alertBackgroundView]}>
          {onNicknameAlert && <Alert msg={alertMsg} setOnAlert={setOnAlert} />}
          {onAutoLoginAlert && (
            <Alert
              msg={alertMsg}
              closeRoute={alertRoute}
              isButton
              buttonContent="예"
              buttonRoute={alertRoute}
              buttonPressHandler={alertButtonPressHandeler}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default UserProfileSet;

const styles = StyleSheet.create({
  buttonView: {
    position: "absolute",
    bottom: 170,
  },
});
