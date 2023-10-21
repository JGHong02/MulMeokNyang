import React from "react";
import type { FC } from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity, Text } from "react-native";
import useGoRoute from "../hooks/useGoRoute";

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
