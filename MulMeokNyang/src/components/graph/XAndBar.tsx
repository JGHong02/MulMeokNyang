// FC Type
import type { FC } from "react";
// Hook
import { useState } from "react";
// Platform, StyleSheet, Component
import { Platform, StyleSheet } from "react-native";
import { TouchableOpacity, View, Text, Image } from "react-native";

type XAndBarProps = {
  left: number;
  width: number;
  guage: number;
  xText: string;
};

const XAndBar: FC<XAndBarProps> = ({ left, width, guage, xText }) => {
  // Bar 색깔 지정
  let barColor = "";
  if (guage < 30) {
    barColor = "#d20000cc";
  } else if (guage < 60) {
    barColor = "#fcc21bcc";
  } else if (guage < 90) {
    barColor = "#00843dcc";
  } else if (guage < 150) {
    barColor = "#004aadcc";
  } else {
    barColor = "#d20000cc";
  }

  // Bar 누르고 있는 동안 정확히 몇 %인지 보여주기
  // 누르고있음을 감지할 state
  const [isPressing, setIsPressing] = useState<boolean>(false);

  return (
    <View style={[styles.view]}>
      <TouchableOpacity
        onPressIn={() => setIsPressing(true)}
        onPressOut={() => setIsPressing(false)}
        style={[styles.barContainer, { left }]}>
        <View
          style={[
            styles.barView,
            {
              width,
              backgroundColor: barColor,
            },
            guage > 100
              ? { height: 180 + (guage - 100) * 0.9 - 2 }
              : { height: guage * 1.8 - 2 },
          ]}
        />
      </TouchableOpacity>
      <View
        style={[
          styles.xTextView,
          {
            left,
            width,
          },
        ]}>
        <Text style={[styles.xText]}>{xText}</Text>
      </View>
      {isPressing && (
        <View
          style={[styles.speechBubbleView, { left: left - 40 + width / 2 }]}>
          <Image
            source={require("../../../assets/speechBubble.png")}
            style={[styles.speechBubbleImg]}
          />
          <Text
            style={[
              styles.speechBubbleText,
              Platform.OS === "android" ? { top: 25 } : { top: 30 },
            ]}>{`${guage.toFixed(0)}%`}</Text>
        </View>
      )}
    </View>
  );
};

export default XAndBar;

const styles = StyleSheet.create({
  view: {
    position: "absolute",
    bottom: 0,
  },
  barContainer: {
    // TouchableOpacity
    // 이렇게 안 하면 Android에서 터치 안되는 에러 발생함
    position: "absolute",
    bottom: 25,
  },
  barView: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  xTextView: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
  },
  xText: {
    fontSize: 12,
  },

  // 말풍선
  speechBubbleView: {
    top: 75,
  },
  speechBubbleImg: {
    width: 80,
    height: 63.664,
  },
  speechBubbleText: {
    position: "absolute",
    width: 80,
    textAlign: "center",
    color: "white",
    fontSize: 16,
  },
});
