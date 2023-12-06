// Context
import { CatInfoContext } from "../../../contexts/CatInfoContext";
// FC Type
import type { FC } from "react";
// Hook
import { useContext } from "react";
// Custom Hook
import { useGoBack, useGoRouteWithParams } from "../../../hooks/useGoScreen";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { SafeAreaView, View, Text } from "react-native";
// Custom Component
import TopBar from "../../../components/TopBar";
import ProcessButton from "../../../components/button/ProcessButton";
// styles
import mainViewStyles from "../../../styles/mainViewStyles";

type AlResultType = {
  route: any;
};

const AIResult: FC<AlResultType> = ({ route }) => {
  // AI 분석 결과 전역변수 불러오기
  const { catBreedGV, catColorGV } = useContext(CatInfoContext);

  // 화면 이동 함수
  const goBack = useGoBack();
  const { method } = route.params;
  const goCatFeedStuffRegistration = useGoRouteWithParams(
    "CatFeedStuffRegistration",
    "method",
    method
  );

  return (
    <SafeAreaView>
      <TopBar title="고양이 프로필 등록" />
      <View style={[mainViewStyles.mainView]}>
        <View style={[styles.textView]}>
          <Text style={[styles.title]}>AI 분석 결과</Text>
          <Text style={[styles.explanation]}>
            품종은 <Text style={[styles.underline]}>{`'${catBreedGV}'`}</Text>{" "}
            고양이이며,
          </Text>
          <Text
            style={[
              styles.explanation,
            ]}>{`특징 색깔은 다음과 같이 추출되었습니다.`}</Text>
        </View>
        <View style={[styles.colorCircleView]}>
          <View style={[styles.row]}>
            <View
              style={[
                styles.circle,
                { backgroundColor: catColorGV[0] },
              ]}></View>
            <View
              style={[
                styles.circle,
                { backgroundColor: catColorGV[1] },
              ]}></View>
            <View
              style={[
                styles.circle,
                { backgroundColor: catColorGV[2] },
              ]}></View>
          </View>
          <View style={[styles.row]}>
            <View
              style={[
                styles.circle,
                { backgroundColor: catColorGV[3] },
              ]}></View>
            <View
              style={[
                styles.circle,
                { backgroundColor: catColorGV[4] },
              ]}></View>
          </View>
        </View>
        <View style={[styles.subTextView]}>
          <Text
            style={[
              styles.subText,
            ]}>{`색상은 급수기의 그림자를 고려해 살짝 어둡게 추출됩니다.\n결과가 마음에 들지 않는다면, 이전 화면으로 돌아가\n사진을 수정하고 다시 AI 분석을 진행해 주세요.`}</Text>
        </View>
        <View style={[styles.buttonView]}>
          <ProcessButton
            content="이전"
            canPress
            onPressHandler={goBack}
            halfSize
          />
          <View style={[styles.emptyView]} />
          <ProcessButton
            content="다음"
            canPress
            onPressHandler={goCatFeedStuffRegistration}
            halfSize
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AIResult;

const styles = StyleSheet.create({
  textView: {
    width: 340,
    marginBottom: 30,
  },
  title: {
    fontSize: 25,
    marginBottom: 10,
  },
  underline: {
    textDecorationLine: "underline",
  },
  explanation: {
    fontSize: 16,
    lineHeight: 35,
  },
  colorCircleView: {
    marginTop: 50,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: "#343434",
    marginHorizontal: 15,
  },
  subTextView: {
    width: 330,
    marginTop: 50,
  },
  subText: {
    fontSize: 12,
    color: "#a3a3a3",
    lineHeight: 30,
  },
  buttonView: {
    flexDirection: "row",
    position: "absolute",
    bottom: 170,
  },
  emptyView: {
    width: 25,
  },
});
