import React, { useState, useCallback, useEffect } from "react";
import type { FC, Dispatch, SetStateAction } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import {
  checkEmpty,
  checkEmail,
  checkPw,
  checkPwConfirm,
  checkPhoneNum,
} from "../utils/checkValid";

type InputContainerProps = {
  value: string;
  setValue: Dispatch<SetStateAction<any>>;
  prop: string;
  title: string;
  placeholder?: string;
  isSecret?: boolean;
  optional?: boolean;
  compareValue?: string;
  noResultMsg?: boolean;
  isFindPw?: boolean;
};

const InputContainer: FC<InputContainerProps> = ({
  value,
  setValue,
  prop,
  title,
  placeholder = "",
  isSecret = false,
  optional = false,
  compareValue = "",
  noResultMsg = false,
  isFindPw = false,
}) => {
  const [resultMsgInfo, setResultMsgInfo] = useState<{
    msg: string;
    color: string;
  }>({ msg: "", color: "" });

  const checkValid = useCallback(() => {
    if (prop === "userEmail") {
      setResultMsgInfo(checkEmail(value)[0]);
      setValue((prevForm: any) => ({
        ...prevForm,
        valid: { ...prevForm.valid, userEmail: checkEmail(value)[1] },
      }));
    } else if (prop === "userPw") {
      setResultMsgInfo(checkPw(value)[0]);
      setValue((prevForm: any) => ({
        ...prevForm,
        valid: { ...prevForm.valid, userPw: checkPw(value)[1] },
      }));
    } else if (prop === "userPwConfirm") {
      setResultMsgInfo(checkPwConfirm(compareValue, value)[0]);
      setValue((prevForm: any) => ({
        ...prevForm,
        valid: {
          ...prevForm.valid,
          userPwConfirm: checkPwConfirm(compareValue, value)[1],
        },
      }));
    } else if (prop === "userName") {
      setValue((prevForm: any) => ({
        ...prevForm,
        valid: {
          ...prevForm.valid,
          userName: checkEmpty(value),
        },
      }));
    } else if (prop === "userPhoneNum") {
      setResultMsgInfo(checkPhoneNum(value)[0]);
      setValue((prevForm: any) => ({
        ...prevForm,
        valid: { ...prevForm.valid, userPhoneNum: checkPhoneNum(value)[1] },
      }));
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
    checkValid();
  }, [value, compareValue]);

  return (
    <View style={[styles.inputContainerView]}>
      <Text style={[styles.title]}>{title}</Text>
      <TextInput
        style={[styles.input]}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        secureTextEntry={isSecret}
      />
      {!noResultMsg && resultMsgInfo.msg && (
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
