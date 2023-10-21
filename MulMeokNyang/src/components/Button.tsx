import React, { useCallback } from "react";
import type { FC } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
<<<<<<< Updated upstream
import { useNavigation } from "@react-navigation/native";
=======
import useGoRoute from "../hooks/useGoRoute";
>>>>>>> Stashed changes

type ButtonProps = {
  content: string;
  route: string;
};

const Button: FC<ButtonProps> = ({ content, route }) => {
  const navigation = useNavigation();
  const goRoute = useCallback(() => {
    navigation.navigate(route);
  }, [route]);
  return (
    <TouchableOpacity onPress={goRoute}>
      <View style={[styles.buttonView]}>
        <Text style={[styles.text]}>{content}</Text>
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
});
