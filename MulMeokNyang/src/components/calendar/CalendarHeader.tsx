// FC Type
import type { FC } from "react";
// Platform, StyleSheet, Component
import { Platform, StyleSheet } from "react-native";
import { View, TouchableOpacity, Text } from "react-native";
// Icon
import FIcon from "react-native-vector-icons/Fontisto";
import EIcon from "react-native-vector-icons/Entypo";

type CalendarHeaderProps = {
  headerText: string;
  isCurrentYear: boolean;
  decreaseYear: () => void;
  IncreaseYear: () => void;
};

const CalendarHeader: FC<CalendarHeaderProps> = ({
  headerText,
  isCurrentYear,
  decreaseYear,
  IncreaseYear,
}) => {
  return (
    <View>
      {Platform.OS === "android" ? (
        <View style={[styles.topBar, styles.heightAndroid]}>
          <TouchableOpacity
            onPress={decreaseYear}
            style={[styles.icon, styles.iconAndroid, styles.leftIconAndroid]}>
            <FIcon name="caret-left" size={10} color="#343434" />
          </TouchableOpacity>
          <Text style={[styles.yearText]}>{headerText}</Text>
          {!isCurrentYear && (
            <TouchableOpacity
              onPress={IncreaseYear}
              style={[
                styles.icon,
                styles.iconAndroid,
                styles.rightIconAndroid,
              ]}>
              <FIcon name="caret-right" size={10} color="#343434" />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={[styles.topBar, styles.heightIos]}>
          <TouchableOpacity
            onPress={decreaseYear}
            style={[styles.icon, styles.leftIconIos]}>
            <EIcon name="chevron-small-left" size={30} color="#343434" />
          </TouchableOpacity>
          <Text style={[styles.yearText, styles.fontWeightIos]}>
            {headerText}
          </Text>
          {!isCurrentYear && (
            <TouchableOpacity
              onPress={IncreaseYear}
              style={[styles.icon, styles.rightIconIos]}>
              <EIcon name="chevron-small-right" size={30} color="#343434" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default CalendarHeader;

const styles = StyleSheet.create({
  // topBar
  topBar: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "center",
    height: 51,
    alignItems: "center",
  },
  icon: {
    position: "absolute",
  },
  yearText: {
    fontSize: 20,
  },
  // topBar-Android
  heightAndroid: {
    height: 58,
  },
  iconAndroid: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
  },
  leftIconAndroid: {
    left: 22,
  },
  rightIconAndroid: {
    right: 22,
  },
  // topBar-Ios
  heightIos: {
    height: 51,
  },
  leftIconIos: {
    left: 14,
  },
  rightIconIos: {
    right: 14,
  },
  fontWeightIos: {
    fontWeight: "300",
  },
});
