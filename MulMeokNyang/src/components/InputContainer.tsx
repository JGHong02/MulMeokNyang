import React, { useState, useCallback, useEffect } from "react";
import type { FC, Dispatch, SetStateAction } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { checkEmail, checkPw, checkPwConfirm } from "../utils/checkValid";

type InputContainerProps = {
  value: string;
  setValue: Dispatch<SetStateAction<any>>;
  prop: string;
  title: string;
  isSecret?: boolean;
  optional?: boolean;
  compareValue?: string;
  noCheckValid?: boolean;
};

const InputContainer: FC<InputContainerProps> = ({
  value,
  setValue,
  prop,
  title,
  isSecret = false,
  optional = false,
  compareValue = "",
  noCheckValid = false,
}) => {
  const [resultMsgInfo, setResultMsgInfo] = useState<{
    msg: string;
    color: string;
  }>({ msg: "", color: "" });

  const checkValid = useCallback(() => {
    if (prop === "userEmail") {
      setResultMsgInfo(checkEmail(value));
    } else if (prop === "userPw") {
      setResultMsgInfo(checkPw(value));
    } else if (prop === "userPwConfirm") {
      setResultMsgInfo(checkPwConfirm(compareValue, value));
    }
  }, [value, compareValue]);

  const onChangeText = useCallback(
    (newValue: string) => {
      setValue((prevForm: any) => ({
        ...prevForm,
        [prop]: newValue,
      }));
    },
    [value]
  );

  useEffect(() => {
    if (!noCheckValid) checkValid();
  }, [value, compareValue]);

  return (
    <View style={[styles.inputContainerView]}>
      <Text style={[styles.title]}>{title}</Text>
      <TextInput
        style={[styles.input]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isSecret}
      />
      {resultMsgInfo.msg && (
        <Text style={[styles.log, { color: resultMsgInfo.color }]}>
          {resultMsgInfo.msg}
        </Text>
      )}
    </View>
  );
};

export default InputContainer;

const styles = StyleSheet.create({
  inputContainerView: { width: 350, marginBottom: 30 },
  title: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    height: 70,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    color: "rgba(0, 0, 0, 0.7)",
  },
  log: {
    marginTop: 5,
  },
});
