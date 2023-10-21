import React, { useCallback } from "react";
import type { FC } from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

type UnderlineTextButtonProps = {
  text: string;
  route: string;
};

const UnderlineTextButton: FC<UnderlineTextButtonProps> = ({ text, route }) => {
  const navigation = useNavigation();
  const goRoute = useCallback(() => {
    navigation.navigate(route);
  }, [route]);

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
