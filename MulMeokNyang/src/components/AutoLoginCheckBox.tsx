// FC, Dispatch, SetStateAction Type
import type { FC, Dispatch, SetStateAction } from "react";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { TouchableOpacity, View, Text } from "react-native";
// Icon
import Icon from "react-native-vector-icons/FontAwesome";

type AutoLoginCheckBoxProps = {
  isChecked: boolean;
  setCheck: Dispatch<SetStateAction<boolean>>;
};

const AutoLoginCheckBox: FC<AutoLoginCheckBoxProps> = ({
  isChecked,
  setCheck,
}) => {
  return (
    <View style={[styles.checkBoxView]}>
      <View style={[styles.leftEmptyView]} />
      <TouchableOpacity
        style={[styles.checkBox, isChecked ? styles.checked : styles.unChecked]}
        onPress={() => setCheck((prev) => !prev)}>
        {isChecked && <Icon name="check" size={20} color="white" />}
      </TouchableOpacity>
      <Text style={[styles.autoLoginText]}>자동 로그인</Text>
      <View style={[styles.rightEmptyView]} />
    </View>
  );
};

export default AutoLoginCheckBox;

const styles = StyleSheet.create({
  checkBoxView: {
    flexDirection: "row",
    marginBottom: 40,
    top: -10,
  },
  checkBox: {
    alignItems: "center",
    justifyContent: "center",
    width: 25,
    height: 25,
    marginRight: 10,
  },
  checked: {
    backgroundColor: "#a3a3a3",
  },
  unChecked: {
    backgroundColor: "#cecece",
  },
  autoLoginText: {
    fontSize: 15,
  },
  leftEmptyView: {
    flex: 1,
  },
  rightEmptyView: {
    flex: 8,
  },
});
