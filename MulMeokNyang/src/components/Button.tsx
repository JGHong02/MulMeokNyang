// 삭제할 예정인 컴포넌트
import type { FC } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import useGoRoute from "../hooks/useGoRoute";

type ButtonProps = {
  content: string;
  route: string;
  canPress: boolean;
};

const Button: FC<ButtonProps> = ({ content, route, canPress }) => {
  const goRoute = useGoRoute(route);

  return (
    <TouchableOpacity disabled={!canPress} onPress={goRoute}>
      <View style={[styles.buttonView, !canPress && styles.canNotPressBtn]}>
        <Text style={[styles.text, !canPress && styles.canNotPressText]}>
          {content}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

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
  canNotPressBtn: {
    backgroundColor: "#004aad",
  },
  canNotPressText: {
    color: "#a3a3a3",
  },
});
