// FC, Dispatch, SetStateAction Type
import type { FC, Dispatch, SetStateAction } from "react";
// Hook
import { useCallback } from "react";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { View, TouchableOpacity } from "react-native";
// Custom Component
import ButtonUI from "./ButtonUI";

type SelectButtonProps = {
  content1: string;
  content2: string;
  value: boolean;
  setValue: Dispatch<SetStateAction<any>>;
  prop: string;
};

const SelectButton: FC<SelectButtonProps> = ({
  content1,
  content2,
  value,
  setValue,
  prop,
}) => {
  // 기본 적으로, 왼쪽 버튼이 눌려 있을 때 value 값이 true이고,
  // 오른쪽 버튼이 눌려 있을 때 false

  const onPressLeftButton = useCallback(() => {
    // value 값이 true (= 이미 왼쪽 버튼이 눌린 상태)일 때 눌렀다면, early return
    if (value) return;
    // 아니라면, 왼쪽 버튼을 누른 상태(true)로 바꾸기
    setValue((prevFormInfo: any) => ({
      ...prevFormInfo,
      [prop]: true,
    }));
  }, [value]);

  const onPressRightButton = useCallback(() => {
    // value 값이 false (= 이미 오른쪽 버튼이 눌린 상태)일 때 눌렀다면, early return
    if (!value) return;
    // 아니라면, 오른쪽 버튼을 누른 상태(false)로 바꾸기
    setValue((prevFormInfo: any) => ({
      ...prevFormInfo,
      [prop]: false,
    }));
  }, [value]);

  return (
    <View style={[styles.buttonsView]}>
      <TouchableOpacity onPress={onPressLeftButton}>
        <ButtonUI content={content1} pressed={value} halfSize />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressRightButton}>
        <ButtonUI content={content2} pressed={!value} halfSize />
      </TouchableOpacity>
    </View>
  );
};

export default SelectButton;

const styles = StyleSheet.create({
  buttonsView: {
    width: 340,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
});
