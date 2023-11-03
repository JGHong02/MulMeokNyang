// FC, Dispatch, SetStateAction Type
import type { FC, Dispatch, SetStateAction } from "react";
// Hook
import { useCallback } from "react";
// Custom Hook
import useGoRoute from "../../hooks/useGoRoute";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { View, TouchableOpacity, Text } from "react-native";
// Custom Component
import ProcessButton from "../button/ProcessButton";
// Icon
import Icon from "react-native-vector-icons/AntDesign";

type AlertProps = {
  msg: string;
  setOnAlert?: Dispatch<SetStateAction<boolean>>;
  closeRoute?: string;
  isButton?: boolean;
  buttonContent?: string;
  buttonRoute?: string;
  buttonPressHandler?: () => void;
};

const Alert: FC<AlertProps> = ({
  msg,
  setOnAlert = () => {},
  closeRoute = "",
  isButton = false,
  buttonContent = "",
  buttonRoute = "",
  buttonPressHandler = () => {},
}) => {
  let goCloseRoute: () => void;
  if (closeRoute) {
    goCloseRoute = useGoRoute(closeRoute);
  }

  const closePressHandler = useCallback(() => {
    // close(X 아이콘)을 눌렀을 때 이동할 route가 있다면 useGoRoute
    if (closeRoute) {
      goCloseRoute();
    } else {
      // 없다면 onAlert state 값 false로 바꾸며 창 닫기
      setOnAlert(false);
    }
  }, []);

  return (
    <View style={[styles.alertView]}>
      <TouchableOpacity onPress={closePressHandler} style={[styles.closeIcon]}>
        <Icon name="close" size={35} color="#343434" />
      </TouchableOpacity>
      <Text style={[styles.text, isButton && styles.textWithButton]}>
        {msg}
      </Text>
      {isButton && (
        <View style={[styles.buttonView]}>
          <ProcessButton
            content={buttonContent}
            canPress
            onPressHandler={buttonPressHandler}
            route={buttonRoute}
            isInAlert
          />
        </View>
      )}
    </View>
  );
};

export default Alert;

const styles = StyleSheet.create({
  alertView: {
    position: "relative",
    justifyContent: "center",
    width: 352,
    height: 232,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    backgroundColor: "white",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  text: {
    fontSize: 20,
    textAlign: "center",
  },
  textWithButton: {
    bottom: 10,
  },
  buttonView: {
    position: "absolute",
    bottom: 0,
  },
});
