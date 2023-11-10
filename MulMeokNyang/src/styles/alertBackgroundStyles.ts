import { Dimensions, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");

const alertBackgroundStyles = StyleSheet.create({
  alertBackgroundView: {
    position: "absolute",
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
  },
});

export default alertBackgroundStyles;
