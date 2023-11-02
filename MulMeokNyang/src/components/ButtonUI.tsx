import type { FC } from "react";
import { StyleSheet, View, Text } from "react-native";

type ButtonUIProps = {
  content: string;
  canPress: boolean;
};

const ButtonUI: FC<ButtonUIProps> = ({ content, canPress }) => {
  return (
    <View style={[styles.buttonView, !canPress && styles.canNotPressButton]}>
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
  text: {
    color: "white",
    fontSize: 20,
  },
  canNotPressButton: {
    backgroundColor: "#004aad",
  },
  canNotPressText: {
    color: "#a3a3a3",
  },
});
