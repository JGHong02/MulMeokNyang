import type { FC } from "react";
import { StyleSheet, View, Text } from "react-native";
import Button from "./Button";

type AlertProps = {
  msg: string;
  isButton?: boolean;
  buttonContent?: string;
  route?: string;
};

const Alert: FC<AlertProps> = ({
  msg,
  isButton = false,
  buttonContent = "",
  route = "",
}) => {
  return (
    <View>
      <Text>{msg}</Text>
    </View>
  );
};

export default Alert;
