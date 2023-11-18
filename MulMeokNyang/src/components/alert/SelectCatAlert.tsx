// Context
import { UserContext } from "../../contexts/UserContext";
// FC, Dispatch, SetStateAction Type
import type { FC, Dispatch, SetStateAction } from "react";
// Hook
import { useState, useCallback, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { View, TouchableOpacity, Text } from "react-native";
// Custom Component
import CatProfileList from "../CatProfileList";
import ProcessButton from "../button/ProcessButton";
// API
import { deleteCatInfo } from "../../api/drawer/deleteCatInfo";
// Icon
import Icon from "react-native-vector-icons/AntDesign";

type SelectCatAlertProps = {
  setAlertInfo: Dispatch<SetStateAction<any>>;
  typeOfInfo: string;
  typeOfAction: string;
  idArr: string[];
  photoUrlArr: string[];
  route: string;
};

const SelectCatAlert: FC<SelectCatAlertProps> = ({
  setAlertInfo,
  typeOfInfo,
  typeOfAction,
  idArr,
  photoUrlArr,
  route,
}) => {
  // 수정 or 삭제하려고 선택한 고양이의 Id state
  const [currentSelectedCatId, setCurrentSelectedCatId] = useState<string>(
    idArr[0]
  );

  // 1. '수정'
  // 버튼 누르면 params로 catId 같이 전달하며 화면 이동
  // currentSelectedCatId 값 바뀔 때마다 전달할 params 값이 달라지기 때문에
  // 최신 값을 반영하여 이동 함수 재생성 하기 위해 useCallback 사용
  const navigation = useNavigation();
  const goAfterRoute = useCallback(() => {
    if (typeOfAction !== "수정") return;

    // Alert 끄고 이동
    setAlertInfo((prev: any) => ({ ...prev, onSelectCatAlert: false }));
    navigation.navigate(route, { catId: currentSelectedCatId });
  }, [currentSelectedCatId]);

  // 2. '삭제'
  const { managementSpaceIdGV } = useContext(UserContext);
  const deleteInfo = useCallback(async () => {
    if (typeOfAction !== "삭제") return;

    try {
      // Alert 끄고 삭제
      setAlertInfo((prev: any) => ({ ...prev, onSelectCatAlert: false }));
      await deleteCatInfo(managementSpaceIdGV, currentSelectedCatId);
    } catch (error: any) {
      console.log(
        "SelectCatAlert의 deleteCatInfo 호출에서 error 발생 :",
        error.message
      );
      throw error;
    }
  }, [currentSelectedCatId]);

  return (
    <View style={[styles.alertView]}>
      <TouchableOpacity
        onPress={() =>
          setAlertInfo((prev: any) => ({ ...prev, onSelectCatAlert: false }))
        }
        style={[styles.closeIcon]}>
        <Icon name="close" size={35} color="#343434" />
      </TouchableOpacity>
      <View style={[styles.titleTextView]}>
        <Text style={[styles.titleText]}>
          {typeOfInfo && `${typeOfInfo} 정보를\n`}
          {`${typeOfAction}할 고양이의\n프로필을 선택해주세요.`}
        </Text>
      </View>
      <View style={[styles.subTextView]}>
        {typeOfAction === "삭제" && (
          <Text style={[styles.subText]}>
            {`관련 데이터가 모두 삭제되며\n다시 복구할 수 없습니다.\n신중하게 선택해주시기 바랍니다.`}
          </Text>
        )}
      </View>
      <View style={[styles.catProfileListView]}>
        <CatProfileList
          idArr={idArr}
          photoUrlArr={photoUrlArr}
          currentSelectedCatId={currentSelectedCatId}
          setCurrentSelectedCatId={setCurrentSelectedCatId}
        />
      </View>
      <View style={[styles.buttonView]}>
        <ProcessButton
          content={typeOfAction}
          canPress
          onPressHandler={typeOfAction === "수정" ? goAfterRoute : deleteInfo}
          route={typeOfAction === "삭제" ? "Main" : ""}
          isInAlert
        />
      </View>
    </View>
  );
};

export default SelectCatAlert;

const styles = StyleSheet.create({
  alertView: {
    position: "relative",
    width: 352,
    height: 350,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "white",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  titleTextView: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  titleText: {
    fontSize: 20,
  },
  subTextView: {
    position: "absolute",
    top: 110,
    left: 20,
  },
  subText: {
    fontSize: 12,
    color: "#474747",
  },
  catProfileListView: {
    position: "absolute",
    top: 180,
    left: 20,
    width: 312,
  },
  buttonView: {
    position: "absolute",
    bottom: 0,
  },
});
