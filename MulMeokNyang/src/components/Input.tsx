import React, { useCallback } from "react";
import type { FC, Dispatch, SetStateAction } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";

type InputContinerProps = {
  value: string;
  setInput: Dispatch<SetStateAction<string>>;
  title: string;
  log: string;
  logColor: string;
  isSecret: boolean;
  optional: boolean;
};

const InputContainer: FC<InputContinerProps> = ({
  value,
  setInput,
  title,
  log,
  logColor,
  isSecret,
  optional,
}) => {
  const onChangeText = useCallback((newValue: string) => {
    setInput(newValue);
  }, []);

  return (
    <View style={[styles.inputContainerView]}>
      <Text style={[styles.title]}>{title}</Text>
      <TextInput
        style={[styles.input]}
        value={value}
        onChangeText={onChangeText}
      />
      {log && <Text style={[styles.log, { color: logColor }]}>{log}</Text>}
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
