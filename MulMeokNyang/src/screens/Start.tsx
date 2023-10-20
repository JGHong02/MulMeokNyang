import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  Button,
} from "react-native";

const { width } = Dimensions.get("window");
const logo = require("../../assets/MulMeokNyang_logo.png");
const desiredLogoWidth = width * 0.8;

const Start = () => {
  return (
    <SafeAreaView style={[styles.flex]}>
      <Image source={logo} style={[styles.image]} />
    </SafeAreaView>
  );
};

export default Start;

const styles = StyleSheet.create({
  flex: { flex: 1, alignItems: "center" },
  image: { width: desiredLogoWidth, resizeMode: "contain" },
});
