// FC, Dispatch, SetStateAction Type
import type { FC, Dispatch, SetStateAction } from "react";
// Hook
import { useState, useCallback, useEffect } from "react";
// Custom Hook
import useLoading from "../../hooks/useLoading";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { View, Text, TextInput, ActivityIndicator } from "react-native";
// API
import { checkEmailAvailable } from "../../api/localSignUp/checkEmailAvailable";

type InputContainerProps = {
  value: string;
  setValue: Dispatch<SetStateAction<any>>;
  prop: string;
  title: string;
  placeholder?: string;
  isSecret?: boolean;
  optional?: boolean;
  readonly?: boolean;
  compareValue?: string;
  checkValue?: (arg1: string, arg2?: any) => any;
  needToCheckEmailAvailable?: boolean;
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
  readonly = false,
  compareValue = "",
  checkValue = () => {},
  needToCheckEmailAvailable = false,
  noResultMsg = false,
}) => {
  const [resultMsgInfo, setResultMsgInfo] = useState<{
    msg: string;
    color: string;
  }>({ msg: "", color: "" });

  const checkValid = useCallback(() => {
    // 필수 입력이 아닌 경우, early return으로 valid 속성이 추가되지 않도록 하기
    if (optional) return;
    setResultMsgInfo(checkValue(value, compareValue)[0]);
    setValue((prevFormInfo: any) => ({
      ...prevFormInfo,
      valid: {
        ...prevFormInfo.valid,
        [prop]: checkValue(value, compareValue)[1],
      },
    }));
  }, [value, compareValue]);

  const onChangeText = useCallback(
    (newValue: string) => {
      setValue((prevFormInfo: any) => ({
        ...prevFormInfo,
        [prop]: newValue,
      }));
    },
    [value]
  );

  useEffect(() => {
    checkValid();
  }, [value, compareValue]);

  // 이메일 중복 검사 함수
  const checkDuplication = useCallback(async (email: string) => {
    try {
      const available = await checkEmailAvailable(email);
      return available;
    } catch (error: any) {
      console.log("checkEmailAvailable 호출에서 error 발생 :", error.message);
    }
  }, []);

  // 데이터 바인딩 전까지 로딩 표시
  const { isLoading, handleLoading } = useLoading();

  useEffect(() => {
    const checkEmailDuplication = async () => {
      if (
        !needToCheckEmailAvailable ||
        resultMsgInfo.msg !== "유효한 이메일입니다."
      )
        return;

      setResultMsgInfo({ msg: "", color: "" });
      handleLoading(true);

      const emailAvailable = await checkDuplication(value);
      if (emailAvailable) {
        // 이메일 사용 가능한 경우 처리
        setResultMsgInfo({
          msg: "사용 가능한 이메일입니다.",
          color: "#00cb51",
        });
      } else {
        setResultMsgInfo({ msg: "이미 가입된 이메일입니다.", color: "red" });
        setValue((prevFormInfo: any) => ({
          ...prevFormInfo,
          valid: {
            ...prevFormInfo.valid,
            userEmail: false,
          },
        }));
      }

      handleLoading(false);
    };

    checkEmailDuplication();
  }, [value, resultMsgInfo.msg]);

  return (
    <View style={[styles.inputContainerView]}>
      <Text style={[styles.title]}>{title}</Text>
      <TextInput
        style={[styles.input]}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        secureTextEntry={isSecret}
        editable={!readonly}
      />
      {!noResultMsg && resultMsgInfo.msg && !isLoading && (
        <Text style={[styles.msg, { color: resultMsgInfo.color }]}>
          {resultMsgInfo.msg}
        </Text>
      )}
      {isLoading && (
        <View style={[styles.loadingView]}>
          <ActivityIndicator size="small" color="#59a0ff" />
        </View>
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
  loadingView: {
    marginTop: 5,
    marginLeft: 5,
    width: 15,
  },
  msg: {
    marginTop: 5,
  },
});
