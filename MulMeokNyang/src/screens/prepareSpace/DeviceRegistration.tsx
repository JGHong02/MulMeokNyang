// Hook
import { useState, useEffect, useCallback } from "react";
// Custom Hook
import { useGoRouteWithParams } from "../../hooks/useGoScreen";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import {
  SafeAreaView,
  Image,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
// Custom Component
import TopBar from "../../components/TopBar";
import Loading from "../../components/Loading";
// styles
import mainViewStyles from "../../styles/mainViewStyles";
import alertBackgroundStyles from "../../styles/alertBackgroundStyles";

// 디바이스 사진
const deviceImage = require("../../../assets/Device.png");

const DeviceRegistration = () => {
  // Loading state
  const [onLoading, setOnLoading] = useState<boolean>(true);

  // 실제로 디바이스를 블루투스를 통해 연결할 수 없기 때문에,
  // 가상으로 연결됐다는 가정 하에 어떤 화면이 나타나는 지만 나타내기
  // 1. DeviceSelectWindow state
  const [onDeviceSelectWindow, setOnDeviceSelectWindow] =
    useState<boolean>(false);
  // 2. optionBgColor state
  const [optionBgColors, setOptionBgColors] = useState(
    Array.from({ length: 10 }, (_, index) => "#343434")
  );
  // 3. 디바이스 연결 후, 1초 뒤에 화면 이동
  const goCatProfileRegistration = useGoRouteWithParams(
    "CatProfileRegistration",
    "method",
    "첫 등록"
  );
  // 4. 연결할 디바이스 클릭 시
  const onPressOption = useCallback(
    (index: number) => {
      // 옵션의 배경색 변경
      const updatedColors = optionBgColors.map((color, i) =>
        i === index ? "rgba(163, 163, 163, 0.4)" : color
      );
      setOptionBgColors(updatedColors);
      // 디바이스 선택 창 닫기
      setTimeout(() => {
        setOnLoading(false);
        setOnDeviceSelectWindow(false);
      }, 300);
      // 0.5초 후에 화면 이동
      setTimeout(goCatProfileRegistration, 800);
    },
    [setOnLoading, setOptionBgColors, setOnDeviceSelectWindow]
  );

  useEffect(() => {
    setTimeout(() => {
      setOnDeviceSelectWindow(true);
    }, 3000);
  }, []);

  return (
    <SafeAreaView>
      <View>
        <TopBar title="급수기 등록" />
        <View style={[mainViewStyles.mainView, styles.mainView]}>
          <Image source={deviceImage} style={[styles.image]} />
          <Text style={[styles.text]}>기기의 페어링 버튼을 눌러주세요!</Text>
          {!onDeviceSelectWindow && <Loading onLoading={onLoading} />}
        </View>
      </View>
      {onDeviceSelectWindow && (
        // alert창은 아니지만, 이 화면에서만 쓰이는 style이기 때문에 빌려 사용
        <View style={[alertBackgroundStyles.alertBackgroundView]}>
          <View style={[styles.deviceSelectWindow]}>
            <Text style={[styles.whiteText, styles.title]}>디바이스</Text>
            <ScrollView style={[styles.scrollView]}>
              {optionBgColors.map((bgColor, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.option, { backgroundColor: bgColor }]}
                  onPress={() => onPressOption(index)}>
                  <Text
                    style={[
                      styles.whiteText,
                      styles.optionText,
                    ]}>{`MulMeokNyang Device ${index + 1}`}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={[styles.emptyView]} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default DeviceRegistration;

const styles = StyleSheet.create({
  mainView: {
    justifyContent: "center",
    height: 600,
  },
  image: {
    width: 190,
    height: 287,
    borderRadius: 7,
  },
  text: {
    fontSize: 20,
    margin: 40,
  },

  // 디바이스 선택창 style
  deviceSelectWindow: {
    width: 300,
    height: 300,
    borderRadius: 10,
    backgroundColor: "#343434",
    alignItems: "center",
  },
  scrollView: {
    width: 300,
  },
  whiteText: {
    color: "white",
  },
  title: {
    fontSize: 20,
    lineHeight: 50,
  },
  option: {
    height: 50,
    justifyContent: "center",
  },
  optionText: {
    paddingLeft: 20,
  },
  emptyView: {
    height: 50,
  },
});
