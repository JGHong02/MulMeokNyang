// Context
import { UserContext } from "../../../contexts/UserContext";
import { CatInfoContext } from "../../../contexts/CatInfoContext";
// FC Type
import type { FC } from "react";
// Hook
import { useState, useContext, useEffect, useCallback } from "react";
// Component
import { SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// Custom Component
import TopBar from "../../../components/TopBar";
import ImageInputContainer from "../../../components/inputContainer/ImageInputContainer";
import InputContainer from "../../../components/inputContainer/InputContainer";
import ProcessButton from "../../../components/button/ProcessButton";
// State Type
import {
  CatProfileSetFormType,
  initialCatProfileSetForm,
} from "../../../data/catInfoSet/catProfileSet/catProfileSetFormType";
// utils
import { checkEmpty } from "../../../utils/checkValid";
import { checkCanPress } from "../../../utils/checkCanPress";
// API
import { getCatProfile } from "../../../api/catInfoSet/catProfileSet/getCatProfile";
import { modifyCatProfile } from "../../../api/catInfoSet/catProfileSet/modifyCatProfile";
// styles
import mainViewStyles from "../../../styles/mainViewStyles";

type CatProfileSetType = {
  method: string;
  // '수정'의 경우 catId가 같이 전달됨
  catId?: string;
  goAfterRoute: () => void;
};

const CatProfileSet: FC<CatProfileSetType> = ({
  method,
  catId = "",
  goAfterRoute,
}) => {
  // catProfilePhoto, catName, catAge, catWeight와 각각의 valid 값이 담긴 state
  const [formInfo, setFormInfo] = useState<CatProfileSetFormType>(
    initialCatProfileSetForm
  );

  // API 호출 시 전달할 managementSpaceId 전역변수 불러오기
  const { managementSpaceIdGV } = useContext(UserContext);

  // '수정'의 경우, formInfo의 값을 getCatProfile API를 호출하여 새로 할당해야 함
  useEffect(() => {
    if (method !== "수정") return; // "첫 등록", "추가 등록"

    // useEffect에서는 async, await를 직접 쓸 수 없기 때문에
    // async 함수를 선언하고 호출해야 함
    const setPrevFormInfo = async () => {
      try {
        const res = await getCatProfile(managementSpaceIdGV, catId);
        setFormInfo({
          catProfilePhotoUrl: res.catProfilePhotoUrl,
          catName: res.catName,
          catAge: res.catAge,
          catWeight: res.catWeight,
          // '수정'의 경우 '등록'을 했을 때 valid가 true여서 DB에 저장된 것이기 때문에
          // 기본 값을 true로 설정하면 됨
          valid: {
            catName: true,
            catAge: true,
            catWeight: true,
          },
        });
      } catch (error: any) {
        console.log(
          "CatProfileSet 화면 getCatProfile 호출에서 error 발생 :",
          error.message
        );
        throw error;
      }
    };
    setPrevFormInfo();
  }, []);

  // ProcessButton의 onPress 이벤트 핸들러 함수
  // 1. '등록'
  // 새로운 고양이 정보를 등록할 때는
  // 프로필, AI 모델용 사진, 습식 사료, 음수량 설정 화면을 모두 거친 다음에
  // cat table에 저장할 수 있기 때문에
  // 마지막 음수량 설정 화면을 가기 전까지 전역 변수에 저장해놓기
  // (아쉬운 점) method가 "수정"일 때는 setter함수를 사용할 필요 없는데..
  //            useCallback 안에서 useContext를 사용할 수 없네
  const { setCatProfilePhotoUrlGV, setCatNameGV, setCatAgeGV, setCatWeightGV } =
    useContext(CatInfoContext);
  // 이벤트 핸들러 함수
  const nextButtonPressHandler = useCallback(() => {
    if (method === "수정") return;

    setCatProfilePhotoUrlGV(formInfo.catProfilePhotoUrl);
    setCatNameGV(formInfo.catName);
    setCatAgeGV(formInfo.catAge);
    setCatWeightGV(formInfo.catWeight);

    // 그 다음 화면으로 이동
    goAfterRoute();
  }, [formInfo]);

  // 2. '수정'
  // 이벤트 핸들러 함수
  const modifyButtonPressHandler = useCallback(async () => {
    if (method !== "수정") return;

    try {
      const modifySuccess = await modifyCatProfile(
        managementSpaceIdGV,
        catId,
        formInfo.catProfilePhotoUrl,
        formInfo.catName,
        formInfo.catAge,
        formInfo.catWeight
      );
      if (modifySuccess) goAfterRoute();
    } catch (error: any) {
      console.log(
        "CatProfileSet 화면 modifyButtonPressHandler 이벤트 핸들러 함수의 modifyCatProfile 호출에서 error 발생 :",
        error.message
      );
    }
  }, [formInfo]);

  // ############################################################################################
  // ####################formInfo 확인용####################
  useEffect(() => {
    console.log(
      "------------------------------------------------------------------------------------------------------------"
    );
    console.log("CatProfileSet 화면의 formInfo를 출력");
    console.log(formInfo);
  }, [formInfo]);

  return (
    <SafeAreaView>
      <TopBar
        back={method === "첫 등록" ? false : true}
        backRoute={method !== "첫 등록" ? "Main" : ""}
        title={method === "수정" ? "고양이 프로필 수정" : "고양이 프로필 등록"}
      />
      <KeyboardAwareScrollView contentContainerStyle={mainViewStyles.mainView}>
        <ImageInputContainer
          method="고양이"
          photoUrl={formInfo.catProfilePhotoUrl}
          setPhotoUrl={setFormInfo}
          prop="catProfilePhotoUrl"
        />
        <InputContainer
          value={formInfo.catName}
          setValue={setFormInfo}
          prop="catName"
          title="이름"
          checkValue={checkEmpty}
          noResultMsg
        />
        <InputContainer
          value={formInfo.catAge}
          setValue={setFormInfo}
          prop="catAge"
          title="나이 (살)"
          placeholder="예시) 3"
          checkValue={checkEmpty}
          noResultMsg
        />
        <InputContainer
          value={formInfo.catWeight}
          setValue={setFormInfo}
          prop="catWeight"
          title="무게 (Kg)"
          placeholder="예시) 5.2"
          checkValue={checkEmpty}
          noResultMsg
        />
        <ProcessButton
          content={method === "수정" ? method : "다음"}
          canPress={checkCanPress(formInfo.valid)}
          onPressHandler={
            method !== "수정"
              ? nextButtonPressHandler
              : modifyButtonPressHandler
          }
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default CatProfileSet;
