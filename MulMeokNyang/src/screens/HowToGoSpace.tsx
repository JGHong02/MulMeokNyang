// StyleSheet, Component
import { StyleSheet } from "react-native";
import { SafeAreaView, View, Text } from "react-native";
// Custom Component
import TopBar from "../components/TopBar";
import ProcessButton from "../components/button/ProcessButton";
// styles
import mainViewStyles from "../styles/mainViewStyles";

const HowToGoSpace = () => {
  return (
    <SafeAreaView>
      <TopBar back={false} title="관리 스페이스 생성" />
      <View style={[mainViewStyles.mainView, styles.mainView]}>
        <View style={[styles.textView]}>
          <Text
            style={[
              styles.text,
            ]}>{`나만의 고양이 음수량 관리\n스페이스를 만드실 분은`}</Text>
          <ProcessButton
            content="나만의 관리 스페이스 만들기"
            canPress
            route="DeviceRegistration"
          />
        </View>
        <View style={[styles.textView]}>
          <Text
            style={[
              styles.text,
            ]}>{`기존 관리 스페이스에\n공동 관리자로 등록되실 분은`}</Text>
          <ProcessButton
            content="공동 관리자 등록 대기"
            canPress
            route="PendingCoManagerAddition"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HowToGoSpace;

const styles = StyleSheet.create({
  mainView: {
    marginTop: 100,
  },
  textView: {
    height: 300,
  },
  text: {
    fontSize: 19,
    lineHeight: 35,
    marginBottom: 15,
  },
});
