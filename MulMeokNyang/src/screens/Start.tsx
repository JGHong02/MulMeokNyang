import React from "react";
import { Dimensions, StyleSheet } from "react-native";
// prettier-ignore
import { SafeAreaView, View, Image, Text } from "react-native";
import RegistButton from "../components/RegistButton";
import UnderlineTextButton from "../components/UnderlineTextButton";

const logo = require("../../assets/MulMeokNyang_logo.png");
const { width } = Dimensions.get("window");
const desiredLogoWidth = width * 0.8;

const Start = () => {
  return (
    <SafeAreaView style={[styles.safeAreaView]}>
      <Image source={logo} style={[styles.logoImage]} />
      <View style={[styles.buttonListView]}>
        <RegistButton method="Naver" />
        <RegistButton method="Kakao" />
        <RegistButton method="Google" />
        <RegistButton method="LocalRegist" />
      </View>
      <View style={[styles.textListView]}>
        <Text style={[styles.text]}>이미 가입 하셨나요?</Text>
        <UnderlineTextButton text="로그인" route="Login" />
      </View>
    </SafeAreaView>
  );
};

export default Start;

const styles = StyleSheet.create({
  safeAreaView: { flex: 1, alignItems: "center" },
  logoImage: { flex: 4, width: desiredLogoWidth, resizeMode: "contain" },
  buttonListView: { flex: 3, justifyContent: "space-around" },
  textListView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginRight: 10,
  },
});
