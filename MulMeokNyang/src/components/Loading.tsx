// FC Type
import type { FC } from "react";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { View, Image } from "react-native";
// Icon
import Icon from "react-native-vector-icons/FontAwesome5";

type LoadingProps = {
  onLoading: boolean;
};

// 로딩 gif
const loadingGif = require("../../assets/Loading.gif");

const Loading: FC<LoadingProps> = ({ onLoading }) => {
  return (
    <View>
      {onLoading ? (
        <View style={styles.center}>
          <View style={[styles.circle, styles.grayCircle]} />
          <View style={[styles.loadingGifView]}>
            <Image source={loadingGif} />
          </View>
          <View style={[styles.circle, styles.whiteCircle]} />
        </View>
      ) : (
        <View style={(styles.center, styles.onLoadingFalse)}>
          <Icon name="check" size={70} color="#004aad" />
        </View>
      )}
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    borderRadius: 65,
    position: "absolute",
  },
  grayCircle: {
    width: 115,
    height: 115,
    backgroundColor: "#d9d9d9",
    zIndex: 1,
  },
  whiteCircle: {
    width: 95,
    height: 95,
    backgroundColor: "#f1f1f1",
    zIndex: 3,
  },
  loadingGifView: {
    zIndex: 2,
  },
  onLoadingFalse: {
    margin: 30,
  },
});
