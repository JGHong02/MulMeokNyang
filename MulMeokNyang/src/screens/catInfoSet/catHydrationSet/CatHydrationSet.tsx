// Context
import { UserContext } from "../../../contexts/UserContext";
import { CatInfoContext } from "../../../contexts/CatInfoContext";
// FC Type
import type { FC } from "react";
// Hook
import { useState, useContext, useCallback, useEffect } from "react";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { SafeAreaView, View, Text } from "react-native";
// Custom Component
import TopBar from "../../../components/TopBar";
import SelectButton from "../../../components/button/SelectButton";
import InputContainer from "../../../components/inputContainer/InputContainer";
import ProcessButton from "../../../components/button/ProcessButton";
// State Type
import {
  CatHydrationSetFormType,
  initialCatHydrationSetForm,
} from "../../../data/catInfoSet/catHydrationSet/catHydrationSetFormType";
// utils
import { checkEmpty } from "../../../utils/checkValid";
import { checkCanPress } from "../../../utils/checkCanPress";
// API
import { getCatHydration } from "../../../api/catInfoSet/catHydrationSet/getCatHydration";
import { registCatInfo } from "../../../api/catInfoSet/catHydrationSet/registCatInfo";
import { modifyCatHydration } from "../../../api/catInfoSet/catHydrationSet/modifyCatHydration";
// styles
import mainViewStyles from "../../../styles/mainViewStyles";

type CatHydrationSetType = {
  method: string;
  // '수정'의 경우 catId가 같이 전달됨
  catId?: string;
  // '등록'의 경우 화면 이동에 두 가지 선택지가 있음
  // '추가 등록' 버튼
  goAdditionalRegistRoute?: () => void;
  // '등록 완료' 버튼
  goFinishRegistRoute?: () => void;
  // '수정' 시 화면 이동
  goAfterModifyRoute?: () => void;
};

const CatHydrationSet: FC<CatHydrationSetType> = ({
  method,
  catId = "",
  goAdditionalRegistRoute = () => {},
  goFinishRegistRoute = () => {},
  goAfterModifyRoute = () => {},
}) => {
  // 권장 음수량 변수
  let recommendedHydration: string = "";

  // '등록' 시 registCatInfo API 호출 또는 권장 음수량 값 계산할 때 사용할 CatInfo 전역변수 불러오고,
  // 전역변수를 초기화할 setter 모두 불러오기
  const {
    catProfilePhotoUrlGV,
    setCatProfilePhotoUrlGV,
    catNameGV,
    setCatNameGV,
    catAgeGV,
    setCatAgeGV,
    catWeightGV,
    setCatWeightGV,
    catPhotosUrlForAIGV,
    setCatPhotosUrlForAIGV,
    isEatingFeedStuffGV,
    setIsEatingFeedStuffGV,
    catFeedStuffDailyConsumptionGV,
    setCatFeedStuffDailyConsumptionGV,
    catFeedStuffMoistureContentGV,
    setCatFeedStuffMoistureContentGV,
  } = useContext(CatInfoContext);

  // '등록' 시 권장 음수량 값 계산
  if (method !== "등록") {
    console.log("무게 :", catWeightGV);
    console.log("섭취량 :", catFeedStuffDailyConsumptionGV);
    console.log("수분 함량 :", catFeedStuffMoistureContentGV);
    recommendedHydration = Math.round(
      parseFloat(catWeightGV) * 50 -
        (parseFloat(catFeedStuffDailyConsumptionGV) *
          parseFloat(catFeedStuffMoistureContentGV)) /
          100
    ).toString();
  }

  // isHydrationAuto, catGoalHydration와 catGoalHydration의 valid 값이 담긴 state
  const [formInfo, setFormInfo] = useState<CatHydrationSetFormType>(
    initialCatHydrationSetForm
  );

  // API 호출 시 전달할 User 전역변수 불러오기
  // 처음 고양이 프로필을 등록하여 관리 스페이스를 생성하는 사용자의 경우 setter도 필요
  const { userEmailGV, managementSpaceIdGV, setManagementSpaceIdGV } =
    useContext(UserContext);

  // '수정'의 경우, formInfo의 값을 getCatHydration API를 호출하여 새로 할당해야 함
  useEffect(() => {
    if (method !== "수정") return; // "첫 등록", "추가 등록"

    // useEffect에서는 async, await를 직접 쓸 수 없기 때문에
    // async 함수를 선언하고 호출해야 함.
    const setPrevFormInfo = async () => {
      const res = await getCatHydration(managementSpaceIdGV, catId);
      try {
        setFormInfo({
          isHydrationAuto: res.isHydrationAuto,
          catGoalHydration: res.catGoalHydration,
          // isHydrationAuto 값이 false('수동')라면, valid는 true였고
          // true('자동')라면, valid와 관계 없이 ProcessButton을 누를 수 있었기에 false
          valid: {
            catGoalHydration: !res.isHydrationAuto ? true : false,
          },
        });

        // 권장 음수량 값 기억해두기
        recommendedHydration = res.catGoalHydration;
      } catch (error: any) {
        console.log(
          "CatHydrationSet 화면 getCatHydration 호출에서 error 발생 :",
          error.message
        );
        throw error;
      }
    };
    setPrevFormInfo();
  }, []);

  // formInfo의 isHydrationAuto 값이 바뀔 때마다 실행될 함수
  useEffect(() => {
    // formInfo의 값 초기화
    setFormInfo((prevFormInfo: CatHydrationSetFormType) => ({
      ...prevFormInfo,
      catGoalHydration: formInfo.isHydrationAuto ? recommendedHydration : "",
      valid: {
        catGoalHydration: false,
      },
    }));
  }, [formInfo.isHydrationAuto]);

  // ProcessButton의 onPress 이벤트 핸들러 함수
  // '등록' 시 두 가지 선택지인
  // '추가 등록' or '등록 완료' 이벤트 핸들러 함수의 공통되는 로직 함수
  const regist = useCallback(
    async (goAfterRoute: () => void) => {
      if (method === "수정") return;

      // 만약 음수량 설정이 자동이었다면 일일 목표 음수량을 권장 음수량으로 설정
      if (formInfo.isHydrationAuto) {
        setFormInfo((prevFormInfo) => ({
          ...prevFormInfo,
          catGoalHydration: recommendedHydration,
        }));
      }

      try {
        const res = await registCatInfo(
          userEmailGV,
          managementSpaceIdGV,
          catProfilePhotoUrlGV,
          catNameGV,
          catAgeGV,
          catWeightGV,
          catPhotosUrlForAIGV,
          isEatingFeedStuffGV,
          catFeedStuffDailyConsumptionGV,
          catFeedStuffMoistureContentGV,
          formInfo.isHydrationAuto,
          formInfo.catGoalHydration
        );

        // catInfo 전역변수 초기화
        setCatProfilePhotoUrlGV("");
        setCatNameGV("");
        setCatAgeGV("");
        setCatWeightGV("");
        setCatPhotosUrlForAIGV([]);
        setIsEatingFeedStuffGV(false);
        setCatFeedStuffDailyConsumptionGV("");
        setCatFeedStuffMoistureContentGV("");

        // 처음 고양이 프로필을 등록하는 사용자 (= 아직 관리 스페이스가 없는 사용자)
        if (res.hasOwnProperty("spaceId")) {
          setManagementSpaceIdGV(res.spaceId);
          goAfterRoute();
          return;
        }

        // 고양이 프로필을 추가 등록하는 중이었던 사용자 (= 관리 스페이스가 이미 있는 사용자)
        const addSuccess = res;
        if (addSuccess) goAfterRoute();
      } catch (error: any) {
        console.log(
          "CatHydrationSet 화면 regist 함수 registCatInfo 호출에서 error 발생 :",
          error.message
        );
        throw error;
      }
    },
    [formInfo, setFormInfo]
  );

  // 1. '추가 등록'
  // 이벤트 핸들러 함수
  const additionalRegistButtonPressHandler = () => {
    regist(goAdditionalRegistRoute);
  };

  // 2. '등록 완료'
  // 이벤트 핸들러 함수
  const finishRegistButtonPressHandler = () => {
    regist(goFinishRegistRoute);
  };

  // 3. 수정'
  const modifyButtonPressHandler = useCallback(async () => {
    if (method !== "수정") return;

    try {
      const modifySuccess = await modifyCatHydration(
        managementSpaceIdGV,
        catId,
        formInfo.isHydrationAuto,
        formInfo.catGoalHydration
      );

      if (modifySuccess) goAfterModifyRoute();
    } catch (error: any) {
      console.log(
        "CatHydrationSet 화면 modifyButtonPressHandler 이벤트 핸들러 함수의 modifyCatHydration 호출에서 error 발생 :",
        error.message
      );
      throw error;
    }
  }, [formInfo]);

  // ############################################################################################
  // ####################formInfo 확인용####################
  useEffect(() => {
    console.log(
      "------------------------------------------------------------------------------------------------------------"
    );
    console.log("CatHydrationSet 화면의 formInfo를 출력");
    console.log(formInfo);
  }, [formInfo]);

  return (
    <SafeAreaView>
      <TopBar
        title={method === "수정" ? "고양이 프로필 수정" : "고양이 프로필 등록"}
      />
      <View style={[mainViewStyles.mainView]}>
        <View style={[styles.textView]}>
          <Text style={[styles.title]}>음수량 설정</Text>
          <Text style={[styles.explanation]}>
            자동으로 설정 시 권장 음수량으로 적용돼요.
          </Text>
        </View>
        <SelectButton
          content1="자동"
          content2="수동"
          value={formInfo.isHydrationAuto}
          setValue={setFormInfo}
          prop="isHydrationAuto"
        />
        {/* '자동'일 때 InputContainer readOnly로 바꿔야 됨 */}
        <InputContainer
          value={formInfo.catGoalHydration}
          setValue={setFormInfo}
          prop="catGoalHydration"
          title="일일 목표 음수량 (ml)"
          checkValue={checkEmpty}
          noResultMsg
          readonly={formInfo.isHydrationAuto ? true : false}
        />
        <View style={[styles.buttonView]}>
          {method !== "수정" ? (
            <View style={[styles.registButtonView]}>
              <ProcessButton
                content="추가 등록"
                canPress={
                  formInfo.isHydrationAuto
                    ? true
                    : checkCanPress(formInfo.valid)
                }
                onPressHandler={additionalRegistButtonPressHandler}
                halfSize
              />
              <View style={[styles.emptyView]} />
              <ProcessButton
                content="등록 완료"
                canPress={
                  formInfo.isHydrationAuto
                    ? true
                    : checkCanPress(formInfo.valid)
                }
                onPressHandler={finishRegistButtonPressHandler}
                halfSize
              />
            </View>
          ) : (
            <ProcessButton
              content="수정"
              canPress={
                formInfo.isHydrationAuto ? true : checkCanPress(formInfo.valid)
              }
              onPressHandler={modifyButtonPressHandler}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CatHydrationSet;

const styles = StyleSheet.create({
  textView: {
    width: 340,
    marginBottom: 30,
  },
  title: {
    fontSize: 25,
    marginBottom: 10,
  },
  explanation: {
    fontSize: 16,
    lineHeight: 30,
  },
  buttonView: {
    position: "absolute",
    bottom: 170,
  },
  registButtonView: {
    flexDirection: "row",
  },
  emptyView: {
    width: 25,
  },
});
