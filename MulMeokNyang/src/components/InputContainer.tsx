import React, { useState, useCallback, useEffect } from "react";
import type { FC, Dispatch, SetStateAction } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";

type InputContainerProps = {
  value: string;
  setValue: Dispatch<SetStateAction<any>>;
  prop: string;
  title: string;
  placeholder?: string;
  isSecret?: boolean;
  optional?: boolean;
  compareValue?: string;
  checkValue: (arg1: string, arg2?: any) => any;
  noResultMsg?: boolean;
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
  checkValue,
  noResultMsg = false,
}) => {
  const [resultMsgInfo, setResultMsgInfo] = useState<{
    msg: string;
    color: string;
  }>({ msg: "", color: "" });

  const checkValid = useCallback(() => {
    setResultMsgInfo(checkValue(value)[0]);
    setValue((prevForm: any) => ({
      ...prevForm,
      valid: { ...prevForm.valid, userEmail: checkValue(value)[1] },
    }));
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
