// FC Type
import type { FC } from "react";
// Hook
import { useState } from "react";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { TouchableHighlight, Text } from "react-native";

type DrawerRotueProps = {
  name: string;
  onPressHandler: () => void;
};

const DrawerRoute: FC<DrawerRotueProps> = ({ name, onPressHandler }) => {
  // 클릭했는 지 여부 state
  const [isPressed, setIsPressed] = useState<boolean>(false);

  return (
    <TouchableHighlight
      onPress={onPressHandler}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      underlayColor="#a3a3a3"
      style={[styles.routeButtonView, styles.borderBottomLine]}>
      <Text style={[styles.routeText, isPressed && styles.pressedText]}>
        {name}
      </Text>
    </TouchableHighlight>
  );
};

export default DrawerRoute;

const styles = StyleSheet.create({
  borderBottomLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#a3a3a3",
  },
  routeButtonView: {
    width: 330,
    height: 50,
    paddingLeft: 30,
    justifyContent: "center",
  },
  pressedView: {
    backgroundColor: "#a3a3a3",
  },
  routeText: {
    fontSize: 17,
  },
  pressedText: {
    color: "white",
  },
});
