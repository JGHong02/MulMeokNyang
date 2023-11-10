// Image-picker
import * as ImagePicker from "expo-image-picker";
// Context
import { CatInfoContext } from "../../../contexts/CatInfoContext";
// FC Type
import type { FC } from "react";
// Hook
import { useState, useContext, useCallback, useEffect } from "react";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
// Custom Component
import TopBar from "../../../components/TopBar";
import ProcessButton from "../../../components/button/ProcessButton";
// State Type
import {
  CatPhotosForAISetFormType,
  initialCatPhotosForAISetForm,
} from "../../../data/catInfoSet/catPhotosForAISet/catPhotosForAISetFormType";
// Icon
import FAIcon from "react-native-vector-icons/FontAwesome";
import MIIcon from "react-native-vector-icons/MaterialIcons";
// styles
import mainViewStyles from "../../../styles/mainViewStyles";

type CatPhotosForAISetType = {
  goAfterRotue: () => void;
};

const CatPhotosForAISet: FC<CatPhotosForAISetType> = ({ goAfterRotue }) => {
  // catPhotosUrlForAI와 valid 값이 담긴 state
  const [formInfo, setFormInfo] = useState<CatPhotosForAISetFormType>(
    initialCatPhotosForAISetForm
  );

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
      console.log(result);
      setFormInfo((prevFormInfo) => {
        const newCatPhotosUrlArr = [...prevFormInfo.catPhotosUrlForAI];
        let areFiveImages = false;
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
  }, [setFormInfo]);

  // 사진 삭제
  const deleteImage = useCallback(
    (index: number) => {
      setFormInfo((prevFormInfo) => {
        const newCatPhotosUrlArr = [...prevFormInfo.catPhotosUrlForAI];
        newCatPhotosUrlArr.splice(index, 1);
        newCatPhotosUrlArr.push("");
        return {
          catPhotosUrlForAI: newCatPhotosUrlArr,
          valid: { catPhotosUrlForAI: false },
        };
      });
    },
    [setFormInfo]
  );

  // ProcessButton의 onPress 이벤트 핸들러 함수
  // DB에 저장하기 전까지 전역 변수 저장
  const { setCatPhotosUrlForAIGV } = useContext(CatInfoContext);
  // 이벤트 핸들러 함수
  const nextButtonPressHandler = useCallback(() => {
    setCatPhotosUrlForAIGV(formInfo.catPhotosUrlForAI);

    // 그 다음 화면으로 이동
    goAfterRotue();
  }, [formInfo]);

  // ############################################################################################
  // ####################formInfo 확인용####################
  useEffect(() => {
    console.log(
      "------------------------------------------------------------------------------------------------------------"
    );
    console.log("CatPhotosForAISet 화면의 formInfo를 출력");
    console.log(formInfo);
  }, [formInfo]);

  return (
    <SafeAreaView>
      <TopBar title="고양이 프로필 등록" />
      <View style={[mainViewStyles.mainView]}>
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
            content="다음"
            canPress={formInfo.valid.catPhotosUrlForAI}
            onPressHandler={nextButtonPressHandler}
          />
        </View>
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
});
