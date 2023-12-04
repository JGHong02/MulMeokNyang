// Image-picker
import * as ImagePicker from "expo-image-picker";
// Context
import { CatInfoContext } from "../../../contexts/CatInfoContext";
// FC Type
import type { FC } from "react";
// Hook
import { useState, useCallback, useEffect, useContext } from "react";
import { useIsFocused } from "@react-navigation/native";
// Custom Hook
import { useGoRouteWithParams } from "../../../hooks/useGoScreen";
import useLoading from "../../../hooks/useLoading";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
// Custom Component
import TopBar from "../../../components/TopBar";
import ProcessButton from "../../../components/button/ProcessButton";
// State Type
import {
  CatPhotosForAISetFormType,
  initialCatPhotosForAISetForm,
} from "../../../data/catInfoSet/catPhotosForAISet/catPhotosForAISetFormType";
// API
import { callAI } from "../../../api/catInfoSet/catPhotosForAISet/callAI";
// Icon
import FAIcon from "react-native-vector-icons/FontAwesome";
import MIIcon from "react-native-vector-icons/MaterialIcons";
// styles
import mainViewStyles from "../../../styles/mainViewStyles";

type CatPhotosForAISetType = {
  method: string;
};

const CatPhotosForAISet: FC<CatPhotosForAISetType> = ({ method }) => {
  // catPhotosUrlForAI와 valid 값이 담긴 state
  const [formInfo, setFormInfo] = useState<CatPhotosForAISetFormType>(
    initialCatPhotosForAISetForm
  );

  // 화면 이동 함수
  const goAIResult = useGoRouteWithParams("AIResult", "method", method);

  // 로딩
  const { isLoading, handleLoading } = useLoading();

  // 사진 권한 요청 Hook
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  // 사진 추가
  const pickImage = useCallback(async () => {
    // 권한 확인
    try {
      if (!status?.granted) {
        const permission = await requestPermission();
        if (!permission.granted) return null;
      }

      // 사진 업로드
      const result = await ImagePicker.launchImageLibraryAsync({
        // 어떤 타입의 파일을 업로드 할 지
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // 사진 업로드 전, 자르기 추가 편집 여부
        allowsEditing: false,
        // 사진 압축 여부, 1로 설정하면 가장 높은 품질로 파일 업로드
        quality: 1,
        // 사진 비율
        aspect: [1, 1],
      });

      // 사진 업로드 취소한 경우
      if (result.canceled) return null;

      // 사진 업로드 결과 및 사진 경로 업데이트
      let areFiveImages = false;

      console.log(result);

      setFormInfo((prevFormInfo) => {
        const newCatPhotosUrlArr = [...prevFormInfo.catPhotosUrlForAI];
        for (let i = 0; i < newCatPhotosUrlArr.length; i++) {
          if (i === 4) {
            areFiveImages = true;
          }
          if (!newCatPhotosUrlArr[i]) {
            newCatPhotosUrlArr[i] = result.assets[0].uri;
            break;
          }
        }
        return {
          catPhotosUrlForAI: newCatPhotosUrlArr,
          valid: { catPhotosUrlForAI: areFiveImages },
        };
      });
    } catch (error) {
      throw error;
    }
  }, []);

  // 사진 삭제
  const deleteImage = useCallback((index: number) => {
    setFormInfo((prevFormInfo) => {
      const newCatPhotosUrlArr = [...prevFormInfo.catPhotosUrlForAI];
      newCatPhotosUrlArr.splice(index, 1);
      newCatPhotosUrlArr.push("");
      return {
        catPhotosUrlForAI: newCatPhotosUrlArr,
        valid: { catPhotosUrlForAI: false },
      };
    });
  }, []);

  // AI 분석 결과 저장할 setter 함수 불러오기
  const { setCatBreedGV, setCatColorGV } = useContext(CatInfoContext);

  // 품종 한국어 변환 함수
  const changeBreedToKor = (engBreed: string) => {
    if (engBreed === "Abyssinian") return "아비시니안";
    if (engBreed === "Bengal") return "벵골";
    if (engBreed === "Birman") return "버만";
    if (engBreed === "Bombay") return "봄베이";
    if (engBreed === "British Shorthair") return "브리티시 숏헤어";
    if (engBreed === "Egyptian Mau") return "이집션 마우";
    if (engBreed === "Maine Coon") return "메인 쿤";
    if (engBreed === "Persian") return "페르시안";
    if (engBreed === "Ragdoll") return "랙돌";
    if (engBreed === "Russian Blue") return "러시안 블루";
    if (engBreed === "Siamese") return "샴";
    if (engBreed === "Sphynx") return "스핑크스";
    return "";
  };

  // 색깔 hex 변환 함수
  const changeColorToHex = (colorStr: string) => {
    // 숫자 값을 추출하여 배열로 변환
    const rgbValues = colorStr.match(/\d+/g)?.map(Number) || [];

    // RGB 배열에서 각각의 값 추출 (Red, Green, Blue)
    const [r, g, b] = rgbValues;

    // 각 값을 HEX로 변환하여 조합
    const componentToHex = (c: number) => {
      const hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    // 각 값을 HEX로 변환하여 조합
    const hexColor = `#${componentToHex(r)}${componentToHex(g)}${componentToHex(
      b
    )}`;

    return hexColor;
  };

  // ProcessButton의 onPress 이벤트 핸들러 함수
  // 이벤트 핸들러 함수
  const analysisButtonPressHandler = useCallback(async () => {
    try {
      handleLoading(true);

      // 고양이 품종, 특징 색깔 추출 AI 모델에 사용자가 올린 사진 5장 전달하며 호출
      const AIResult = await callAI(formInfo.catPhotosUrlForAI);

      // 품종 저장
      setCatBreedGV(changeBreedToKor(AIResult.breed));

      // 색깔 저장 : 5 -> 1 순으로 이미지에서 차지하는 비율 낮아짐
      const catColorArr = [];
      for (let i = 5; i > 0; i--) {
        catColorArr.push(changeColorToHex(AIResult[`color${i}`]));
      }
      setCatColorGV(catColorArr);

      handleLoading(false);
    } catch (error: any) {
      console.log("uploadPhotosToLocal 호출에서 error 발생 :", error.message);
      throw error;
    }

    // 그 다음 화면으로 이동
    goAIResult();
  }, [formInfo]);

  // 다시 돌아올 때마다 formInfo 초기화
  const isFocused = useIsFocused();
  useEffect(() => {
    setFormInfo(initialCatPhotosForAISetForm);
  }, [isFocused]);

  return (
    <SafeAreaView>
      <TopBar title="고양이 프로필 등록" />
      <View style={[mainViewStyles.mainView]}>
        {isLoading ? (
          <View>
            <ActivityIndicator size="large" color="#59a0ff" />
            <View style={[styles.AITextView]}>
              <Text
                style={[
                  styles.AIText,
                ]}>{`AI 분석을 진행중입니다.\n대략 20초 소요되오니, 잠시만 기다려주세요.`}</Text>
            </View>
          </View>
        ) : (
          <>
            <View style={[styles.textView]}>
              <Text style={[styles.title]}>사진 등록</Text>
              <Text
                style={[
                  styles.explanation,
                ]}>{`품종과 눈, 털 색깔로 고양이를 인식해요!\n아래의 예시 사진에 맞게 사진을 찍어\n총 5장을 등록해주세요.`}</Text>
            </View>
            <View style={[styles.exImageView]}>
              <Image
                source={require("../../../../assets/AIPhotosEx/Ex1.png")}
                style={[styles.exImage]}
              />
              <Image
                source={require("../../../../assets/AIPhotosEx/Ex2.png")}
                style={[styles.exImage]}
              />
              <Image
                source={require("../../../../assets/AIPhotosEx/Ex3.png")}
                style={[styles.exImage]}
              />
            </View>
            <View style={[styles.uploadView]}>
              <TouchableOpacity
                onPress={pickImage}
                disabled={formInfo.valid.catPhotosUrlForAI}>
                <FAIcon name="camera" size={40} />
              </TouchableOpacity>
              <View style={[styles.uploadedImagesView]}>
                <FlatList
                  contentContainerStyle={[styles.flatList]}
                  data={formInfo.catPhotosUrlForAI}
                  horizontal
                  renderItem={({ item, index }) => (
                    <View style={[styles.itemView]}>
                      {item ? (
                        <>
                          <Image source={{ uri: item }} style={[styles.item]} />
                          <TouchableOpacity
                            onPress={() => deleteImage(index)}
                            style={[styles.deleteIcon]}>
                            <MIIcon name="cancel" size={18} color="red" />
                            <View style={[styles.deleteIconBackground]} />
                          </TouchableOpacity>
                        </>
                      ) : (
                        <View style={[styles.item, styles.emptyImageView]} />
                      )}
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  ItemSeparatorComponent={() => (
                    <View style={[styles.itemSeparator]} />
                  )}
                />
              </View>
            </View>
            <View style={[styles.buttonView]}>
              <ProcessButton
                content="AI 분석하기"
                canPress={formInfo.valid.catPhotosUrlForAI}
                onPressHandler={analysisButtonPressHandler}
              />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CatPhotosForAISet;

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
  exImageView: {
    flexDirection: "row",
    width: 340,
    justifyContent: "space-between",
  },
  exImage: {
    width: 110,
    height: 110,
    borderRadius: 5,
  },
  uploadView: {
    width: 340,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
  },
  buttonView: {
    position: "absolute",
    bottom: 170,
  },

  // FlatList
  uploadedImagesView: {
    width: 280,
    height: 60,
    borderWidth: 2,
    borderStyle: "dotted",
    borderRadius: 10,
    alignItems: "center",
  },
  flatList: {
    width: 260,
    justifyContent: "center",
    alignItems: "center",
  },
  itemView: {
    position: "relative",
  },
  item: {
    width: 42,
    height: 42,
    borderRadius: 15,
  },
  emptyImageView: {
    borderWidth: 1,
    borderStyle: "dotted",
  },
  deleteIcon: {
    position: "absolute",
    top: -5,
    right: -5,
  },
  deleteIconBackground: {
    position: "absolute",
    top: 2,
    right: 2,
    zIndex: -1,
    width: 13,
    height: 13,
    backgroundColor: "white",
    borderRadius: 100,
  },
  itemSeparator: {
    width: 8,
  },

  // 로딩
  AITextView: {
    marginTop: 30,
  },
  AIText: {
    fontSize: 16,
    color: "#a3a3a3",
    textAlign: "center",
    lineHeight: 30,
  },
});
