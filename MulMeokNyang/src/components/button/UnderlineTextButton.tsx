// FC Type
import type { FC } from "react";
// Custom Hook
import { useGoRoute } from "../../hooks/useGoScreen";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { TouchableOpacity, Text } from "react-native";

type UnderlineTextButtonProps = {
  text: string;
  route: string;
};

const UnderlineTextButton: FC<UnderlineTextButtonProps> = ({ text, route }) => {
  const goRoute = useGoRoute(route);

  return (
    <TouchableOpacity onPress={goRoute}>
      <Text style={[styles.underlineText]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default UnderlineTextButton;

const styles = StyleSheet.create({
  underlineText: {
    textDecorationLine: "underline",
  },
});
