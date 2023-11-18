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
      <Icon name="circle" size={5} style={[styles.icon]} />
      <TouchableOpacity onPress={onPressHandler}>
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
    paddingLeft: 45,
    height: 35,
  },
  icon: {
    position: "absolute",
    left: 40,
    lineHeight: 35,
  },
  text: {
    position: "absolute",
    left: 15,
    fontSize: 17,
    lineHeight: 35,
    textDecorationLine: "underline",
  },
});
