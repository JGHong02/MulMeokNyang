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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// Custom Component
import TopBar from "../../../components/TopBar";
import SelectButton from "../../../components/button/SelectButton";
import InputContainer from "../../../components/inputContainer/InputContainer";
import ProcessButton from "../../../components/button/ProcessButton";
// State Type
import {
  CatFeedStuffSetFormType,
  initialCatFeedStuffSetForm,
} from "../../../data/catInfoSet/catFeedStuffSet/catFeedStuffSetFormType";
// utils
import { checkEmpty } from "../../../utils/checkValid";
import { checkCanPress } from "../../../utils/checkCanPress";
// API
import { getCatFeedStuff } from "../../../api/catInfoSet/catFeedStuffSet/getCatFeedStuff";
import { modifyCatFeedStuff } from "../../../api/catInfoSet/catFeedStuffSet/modifyCatFeedStuff";
// styles
import mainViewStyles from "../../../styles/mainViewStyles";

type CatFeedStuffSetType = {
  method: string;
  // '수정'의 경우 catId가 같이 전달됨
  catId?: string;
  goAfterRoute: () => void;
};

const CatFeedStuffSet: FC<CatFeedStuffSetType> = ({
  method,
  catId = "",
  goAfterRoute,
}) => {
  // isEatingFeedStuff, catFeedStuffDailyConsumption, catFeedStuffMoistureContent와
  // catFeedStuffDailyConsumption의 valid 값이 담긴 state
  const [formInfo, setFormInfo] = useState<CatFeedStuffSetFormType>(
    initialCatFeedStuffSetForm
  );

  // API 호출 시 전달할 managementSpaceId 전역변수 불러오기
  const { managementSpaceIdGV } = useContext(UserContext);

  // '수정'의 경우, formInfo의 값을 getCatFeedStuff API를 호출하여 새로 할당해야 함
  useEffect(() => {
    if (method !== "수정") return; // "첫 등록", "추가 등록"

    // useEffect에서는 async, await를 직접 쓸 수 없기 때문에
    // async 함수를 선언하고 호출해야 함.
    const setPrevFormInfo = async () => {
      const res = await getCatFeedStuff(managementSpaceIdGV, catId);
      try {
        setFormInfo({
          isEatingFeedStuff: res.isEatingFeedStuff,
          catFeedStuffDailyConsumption: res.catFeedStuffDailyConsumption,
          catFeedStuffMoistureContent: res.catFeedStuffMoistureContent,
          // isEatingFeedStuff 값이 true('예')라면, valid는 true였고
          // false('아니오')라면, valid와 관계 없이 ProcessButton을 누를 수 있었기에 false
          valid: {
            catFeedStuffDailyConsumption: res.isEatingFeedStuff ? true : false,
            catFeedStuffMoistureContent: true,
          },
        });
      } catch (error: any) {
        console.log(
          "CatFeedStuffSet 화면 getCatFeedStuff 호출에서 error 발생 :",
          error.message
        );
        throw error;
      }
    };
    setPrevFormInfo();
  }, []);

  // formInfo의 isEatingFeedStuff 값이 바뀔 때마다 실행될 함수
  useEffect(() => {
    // formInfo의 나머지 값 초기화
    setFormInfo((prevFormInfo: CatFeedStuffSetFormType) => ({
      ...prevFormInfo,
      catFeedStuffDailyConsumption: formInfo.isEatingFeedStuff ? "" : "0",
      catFeedStuffMoistureContent: formInfo.isEatingFeedStuff ? "70" : "0",
      valid: {
        // isEatingFeedStuff 값이 false('아니오')일 때는, valid는 무관하게 ProcessButton 누를 수 있음
        catFeedStuffDailyConsumption: false,
        catFeedStuffMoistureContent: true,
      },
    }));
  }, [formInfo.isEatingFeedStuff]);

  // ProcessButton의 onPress 이벤트 핸들러 함수
  // '등록' or '수정' 이벤트 핸들러 함수 공통되는 로직 함수

  // const setDefaultMoistureContent = useCallback(() => {
  //   // 만약 습식 사료 수분 함량을 입력하지 않았다면 70으로 설정
  //   if (formInfo.isEatingFeedStuff && !formInfo.catFeedStuffMoistureContent) {
  //     setFormInfo((prevFormInfo) => ({
  //       ...prevFormInfo,
  //       catFeedStuffMoistureContent: "70",
  //     }));
  //   }
  // }, [formInfo, setFormInfo]);

  // 1. '등록'
  // DB에 저장하기 전까지 전역 변수 저장
  const {
    setIsEatingFeedStuffGV,
    setCatFeedStuffDailyConsumptionGV,
    setCatFeedStuffMoistureContentGV,
  } = useContext(CatInfoContext);
  // 이벤트 핸들러 함수
  const nextButtonPressHandler = useCallback(() => {
    if (method === "수정") return;

    // setDefaultMoistureContent();
    setIsEatingFeedStuffGV(formInfo.isEatingFeedStuff);
    setCatFeedStuffDailyConsumptionGV(formInfo.catFeedStuffDailyConsumption);
    setCatFeedStuffMoistureContentGV(formInfo.catFeedStuffMoistureContent);

    // 그 다음 화면으로 이동
    goAfterRoute();
  }, [formInfo]);

  // 2. '수정'
  // 이벤트 핸들러 함수
  const modifyButtonPressHandler = useCallback(async () => {
    if (method !== "수정") return;

    // setDefaultMoistureContent();

    try {
      const modifySuccess = await modifyCatFeedStuff(
        managementSpaceIdGV,
        catId,
        formInfo.isEatingFeedStuff,
        formInfo.catFeedStuffDailyConsumption,
        formInfo.catFeedStuffMoistureContent
      );
      if (modifySuccess) goAfterRoute();
    } catch (error: any) {
      console.log(
        "CatFeedStuffSet 화면 modifyButtonPressHandler 이벤트 핸들러 함수의 modifyCatFeedStuff 호출에서 error 발생 :",
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
    console.log("CatFeedStuffSet 화면의 formInfo를 출력");
    console.log(formInfo);
  }, [formInfo]);

  return (
    <SafeAreaView>
      <TopBar
        title={method === "수정" ? "고양이 프로필 수정" : "고양이 프로필 등록"}
      />
      <KeyboardAwareScrollView contentContainerStyle={mainViewStyles.mainView}>
        <View style={[styles.textView]}>
          <Text
            style={[
              styles.text,
            ]}>{`습식 사료를 주기적으로\n섭취중인가요?`}</Text>
        </View>
        <SelectButton
          content1="예"
          content2="아니오"
          value={formInfo.isEatingFeedStuff}
          setValue={setFormInfo}
          prop="isEatingFeedStuff"
        />
        {formInfo.isEatingFeedStuff && (
          <>
            <InputContainer
              value={formInfo.catFeedStuffDailyConsumption}
              setValue={setFormInfo}
              prop="catFeedStuffDailyConsumption"
              title="일일 섭취량 (g)"
              checkValue={checkEmpty}
              noResultMsg
            />
            <InputContainer
              value={formInfo.catFeedStuffMoistureContent}
              setValue={setFormInfo}
              prop="catFeedStuffMoistureContent"
              title="수분 함량 (%)"
              checkValue={checkEmpty}
              noResultMsg
            />
            <View style={[styles.moistureContentTextView]}>
              <Text style={[styles.moistureContentText]}>
                기본 70%로 적용되나, 수정 가능합니다.
              </Text>
            </View>
          </>
        )}
        <View style={[styles.buttonView]}>
          <ProcessButton
            content={method === "수정" ? method : "다음"}
            canPress={
              formInfo.isEatingFeedStuff ? checkCanPress(formInfo.valid) : true
            }
            onPressHandler={
              method !== "수정"
                ? nextButtonPressHandler
                : modifyButtonPressHandler
            }
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default CatFeedStuffSet;

const styles = StyleSheet.create({
  textView: {
    width: 340,
    marginBottom: 30,
  },
  text: {
    fontSize: 20,
    lineHeight: 30,
  },
  moistureContentTextView: {
    width: 340,
    bottom: 20,
  },
  moistureContentText: {
    color: "#00cb51",
  },
  buttonView: {
    position: "absolute",
    bottom: 170,
  },
});
