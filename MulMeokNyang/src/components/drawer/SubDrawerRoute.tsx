// FC Type
import type { FC } from "react";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { View, TouchableOpacity, Text } from "react-native";
// Icon
import Icon from "react-native-vector-icons/FontAwesome";

type SubDrawerRouteProps = {
  name: string;
  onPressHandler: () => void;
};

const SubDrawerRoute: FC<SubDrawerRouteProps> = ({ name, onPressHandler }) => {
  return (
    <View style={[styles.view]}>
      <Icon name="circle" size={5} />
      <TouchableOpacity
        onPress={() => onPressHandler()}
        style={[styles.textContainer]}>
        <Text style={[styles.text]}>{name}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SubDrawerRoute;

const styles = StyleSheet.create({
  view: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 45,
    height: 35,
  },
  textContainer: {
    position: "absolute",
    left: 60,
  },
  text: {
    fontSize: 17,
    lineHeight: 33,
    textDecorationLine: "underline",
  },
});
