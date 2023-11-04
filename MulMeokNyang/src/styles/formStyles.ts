import { Dimensions, StyleSheet } from "react-native";
const { height } = Dimensions.get("window");

const formStyles = StyleSheet.create({
  formView: { alignItems: "center", marginTop: 30, height: height },
});

export default formStyles;
