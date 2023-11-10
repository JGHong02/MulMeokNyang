// FC Type
import type { FC } from "react";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { View, Text } from "react-native";

type ButtonUIProps = {
  content: string;
  canPress?: boolean;
  pressed?: boolean;
  isInAlert?: boolean;
  halfSize?: boolean;
};

const ButtonUI: FC<ButtonUIProps> = ({
  content,
  canPress = true,
  pressed = false,
  isInAlert = false,
  halfSize = false,
}) => {
  return (
    <View
      style={[
        styles.buttonView,
        (!canPress || pressed) && styles.deepBlueButton,
        isInAlert && styles.alertButton,
        halfSize && styles.halfSize,
      ]}>
      <Text style={[styles.text, !canPress && styles.canNotPressText]}>
        {content}
      </Text>
    </View>
  );
};

export default ButtonUI;

const styles = StyleSheet.create({
  buttonView: {
    width: 350,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#59a0ff",
    alignItems: "center",
    justifyContent: "center",
  },
  alertButton: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
  },
  deepBlueButton: {
    backgroundColor: "#004aad",
  },
  text: {
    color: "white",
    fontSize: 20,
  },
  canNotPressText: {
    color: "#a3a3a3",
  },
  halfSize: {
    width: 150,
  },
});
