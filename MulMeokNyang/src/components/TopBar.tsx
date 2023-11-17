// FC, Dispatch, SetStateAction Type
import type { FC, Dispatch, SetStateAction } from "react";
// CustomHook
import { useGoRoute, useGoBack } from "../hooks/useGoScreen";
// Platform, StyleSheet, Component
import { Platform, StyleSheet } from "react-native";
import { View, TouchableOpacity, Text } from "react-native";
// Icon
import Icon from "react-native-vector-icons/Entypo";

type TopBarProps = {
  back?: boolean;
  backRoute?: string;
  drawer?: boolean;
  openDrawer?: Dispatch<SetStateAction<boolean>>;
  title: string;
};

const TopBar: FC<TopBarProps> = ({
  back = true,
  backRoute = "",
  drawer = false,
  openDrawer = () => {},
  title,
}) => {
  let goBackIconRoute;
  if (backRoute) {
    goBackIconRoute = useGoRoute(backRoute);
  } else {
    goBackIconRoute = useGoBack();
  }

  return (
    <>
      <View
        style={[
          styles.topBarView,
          Platform.OS === "android" && styles.marginAndroid,
        ]}>
        {back && (
          <TouchableOpacity
            onPress={goBackIconRoute}
            style={[styles.icon, styles.backIcon]}>
            <Icon name="chevron-thin-left" size={30} color="#343434" />
          </TouchableOpacity>
        )}
        <Text style={[styles.text]}>{title}</Text>
        {drawer && (
          <TouchableOpacity
            onPress={() => openDrawer(true)}
            style={[styles.icon, styles.menuIcon]}>
            <Icon name="menu" size={35} />
          </TouchableOpacity>
        )}
      </View>
      <View style={[styles.line]} />
    </>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  topBarView: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  marginAndroid: {
    marginTop: 40,
  },
  icon: {
    position: "absolute",
  },
  backIcon: {
    left: 10,
  },
  menuIcon: {
    right: 10,
  },
  text: {
    fontSize: 20,
  },
  line: { height: 1, backgroundColor: "black", marginTop: 15 },
});
