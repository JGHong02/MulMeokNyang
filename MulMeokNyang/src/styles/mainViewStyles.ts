import { Dimensions, StyleSheet } from "react-native";
const { height } = Dimensions.get("window");

const mainViewStyles = StyleSheet.create({
  mainView: { alignItems: "center", marginTop: 30, height: height },
});

export default mainViewStyles;
