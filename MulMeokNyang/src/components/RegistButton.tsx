import React from "react";
import type { FC } from "react";
// prettier-ignore
import { Platform, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import useGoRoute from "../hooks/useGoRoute";

type RegistButtonProps = {
  method: string;
};

const RegistButton: FC<RegistButtonProps> = ({ method }) => {
  let logoSource, bgColor;
  const route = method;
  if (method === "Naver") {
    logoSource = require("../../assets/registLogo/naver.png");
    bgColor = "#1DC800";
  } else if (method === "Kakao") {
    logoSource = require("../../assets/registLogo/kakao.png");
    bgColor = "#FEE500";
  } else if (method === "Google") {
    logoSource = require("../../assets/registLogo/google.png");
    bgColor = "#ECECEC";
  } else {
    bgColor = "white";
  }

  const goRoute = useGoRoute(route);

  return (
    <TouchableOpacity
      style={[
        styles.buttonView,
        Platform.OS === "android" ? styles.shadowAndroid : styles.shadowIOS,
        { backgroundColor: bgColor },
      ]}
      onPress={goRoute}>
      {method !== "LocalRegist" ? (
        <>
          <Image source={logoSource} style={[styles.logoImage]} />
          <Text style={[styles.Text]}>{method}로 시작하기</Text>
        </>
      ) : (
        <>
          <Text style={[styles.Text]}>이메일로 회원가입</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default RegistButton;

const styles = StyleSheet.create({
  buttonView: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 320,
    height: 50,
    borderRadius: 10,
  },
  shadowAndroid: {
    elevation: 4,
  },
  shadowIOS: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  logoImage: {
    position: "absolute",
    left: 20,
    width: 20,
    height: 20,
    marginRight: 20,
  },
  Text: { fontSize: 15, color: "rgba(0, 0, 0, 0.7)" },
});
