// Context
import { UserContext } from "../../contexts/UserContext";
// FC Type
import type { FC } from "react";
// Hook
import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
// Custom Hook
import useGoRoute from "../../hooks/useGoRoute";
// StyleSheet, Component
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
} from "../../data/userProfile/userProfileFormType";
// utils
import { checkEmpty } from "../../utils/checkValid";
import { checkCanPress } from "../../utils/checkCanPress";
// API
import { getUserProfile } from "../../api/userProfileSet/getUserProfile";
import { registUserProfile } from "../../api/userProfileSet/registUserProfile";
import { modifyUserProfile } from "../../api/userProfileSet/modifyUserProfile";
// Form Data
import FormData from "form-data";
// styles
import formStyles from "../../styles/formStyles";
import alertBackgroundStyles from "../../styles/alertBackgroundStyles";

type UserProfileSetType = {
  method: string;
  // 등록의 경우에만 자동 로그인 설정 Alert가 뜨기 때문에
  // Alert Component의 ProcessButton의 onPressHandler가 필요
  alertButtonPressHandeler?: () => void;
};

const UserProfileSet: FC<UserProfileSetType> = ({
  method,
  alertButtonPressHandeler = () => {},
}) => {
  // userProfilePhoto, userNickname, userIntroduction과 userNickname의 valid 값이 담긴 state
  const [formInfo, setFormInfo] = useState<UserProfileFormType>(
    initialUserProfileForm
  );

  // 전역변수 불러오기
  const { userEmailGV } = useContext(UserContext);

  // ####################formInfo userProfilePhoto 값 어떻게 저장되는 지 확인용####################
  useEffect(() => {
    console.log("formInfo를 출력하겠다!!!!!!!!!!!!");
    console.log(formInfo);
  }, [formInfo]);

  // '수정'의 경우, formInfo의 값을 getUserProfile API를 호출하여 새로 할당해야 함.
  useEffect(() => {
    if (method === "등록") return;

    // useEffect에서는 async, await를 직접 쓸 수 없기 때문에
    // async 함수를 선언하고 호출해야 함
    const setPrevFormInfo = async () => {
      try {
        const res = await getUserProfile(userEmailGV);
        setFormInfo({
          userProfilePhoto: res.userProfilePhoto,
          userNickname: res.userNickname,
          userIntroduction: res.userIntroduction,
          // '수정'의 경우, '등록'을 했을 때 valid가 true여서 DB에 저장된 것이기 때문에
          // 기본 값을 true로 설정하면 됨
          valid: {
            userNickname: true,
          },
        });
      } catch (error) {
        throw error;
      }
    };
    setPrevFormInfo();
  }, [setFormInfo]);

  // 등록 후 화면 이동
  const goHowToGoSpace = useGoRoute("HowToGoSpace");
  // 수정 후 화면 이동
  const navigation = useNavigation();
  const goBack = useCallback(() => navigation.goBack(), []);

  // Alert On 관련 property state
  const [onAlert, setOnAlert] = useState<boolean>(false);
  const [onNicknameAlert, setOnNicknameAlert] = useState<boolean>(false);
  const [onAutoLoginAlert, setOnAutoLoginAlert] = useState<boolean>(false);
  // Alert Msg, Route 관련 property state
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertRoute, setAlertRoute] = useState<string>("");

  // '등록' ProcessButton의 onPress 이벤트 핸들러 함수
  const registButtonPressHandler = useCallback(async () => {
    if (method !== "등록") return;

    try {
      const res = await registUserProfile(
        userEmailGV,
        formInfo.userProfilePhoto,
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

      if (res.hasOwnProperty("registDone")) {
        setAlertMsg("자동 로그인을\n설정하시겠습니까?");
        setAlertRoute("HowToGoSpace");
        setOnNicknameAlert(false);
        setOnAutoLoginAlert(true);
        setOnAlert(true);
      }
    } catch (error) {
      console.error(
        "UserProfileSet의 registButtonPressHandler에서 에러 발생:",
        error
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

  // '수정' ProcessButton의 onPress 이벤트 핸들러 함수
  const modifyButtonPressHandler = useCallback(async () => {
    if (method !== "수정") return;

    try {
      const res = await modifyUserProfile(
        userEmailGV,
        formInfo.userProfilePhoto,
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

      if (res.hasOwnProperty("modifyDone")) {
        goBack();
      }
    } catch (error) {
      console.error(
        "UserProfileSet의 modifyButtonPressHandler에서 에러 발생:",
        error
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

  return (
    <SafeAreaView>
      <View>
        <TopBar
          back={method === "등록" ? false : true}
          title={`프로필 ${method}`}
        />
        <KeyboardAwareScrollView contentContainerStyle={formStyles.formView}>
          <ImageInputContainer
            photo={formInfo.userProfilePhoto}
            setPhoto={setFormInfo}
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
          <ProcessButton
            content={method}
            canPress={checkCanPress(formInfo.valid)}
            onPressHandler={
              method === "등록"
                ? registButtonPressHandler
                : modifyButtonPressHandler
            }
          />
        </KeyboardAwareScrollView>
      </View>
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
