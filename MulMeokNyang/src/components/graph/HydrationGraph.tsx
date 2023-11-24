// FC Type
import type { FC } from "react";
// Hook
import { useState, useEffect } from "react";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { View, Text, FlatList } from "react-native";
// Custom Component
import XAndBar from "./XAndBar";

type HydrationGraphProps = {
  range: string;
  weekRange?: string[];
  monthRange?: string;
  hydrationGuageArr: any[];
};

const HydrationGraph: FC<HydrationGraphProps> = ({
  range,
  weekRange = [],
  monthRange = "",
  hydrationGuageArr,
}) => {
  // 목표 음수량 달성률 평균 state
  const [avg, setAvg] = useState<number>(0);
  // XAndBar 위치, 너비 정보 state
  const [xAndBarInfo, setXAndBarInfo] = useState({
    barInterval: 0,
    barWidth: 0,
  });
  // XAndBar x축 글자 state
  const [xArr, setXArr] = useState<string[]>([]);
  // Bar 출력 시작 Index state
  const [startIndex, setStartIndex] = useState<number>(0);

  useEffect(() => {
    if (hydrationGuageArr.length === 0) return;
    console.log("hydrationGuageArr: ", hydrationGuageArr);

    if (range === "주") {
      // 1. 주
      // 'YYYY-MM-DD' 에서 'DD'만 출력
      const xArr = weekRange.map((value) => {
        return value.split("-")[2];
      });
      console.log("xArr: ", xArr);
      setXArr(xArr);
      setStartIndex(xArr.indexOf(hydrationGuageArr[0].day));

      setXAndBarInfo({
        // Bar 사이 간격
        barInterval: 150 / 11,
        // Bar 너비
        barWidth: 300 / 11,
      });
    } else if (range === "달") {
      // 2. 달
      // 먼저, 해당 달에 총 몇 주가 있는지( = 일요일 수 + 1 ) 확인
      const [year, month] = monthRange.split("-").map(Number);
      const lastDay = new Date(year, month, 0).getDate();
      let date, day, numOfWeek;
      let numOfSunday = 0;

      for (let i = 1; i <= lastDay; i++) {
        date = new Date(year, month - 1, i);
        day = date.getDay();

        if (day === 0) numOfSunday++;
      }

      numOfWeek = numOfSunday + 1;

      if (numOfWeek === 6) {
        // 간혹가다 총 6주가 있는 달이 있는데,
        // 이러한 경우에만 X축 값을 06까지
        setXArr(["01", "02", "03", "04", "05", "06"]);
      } else {
        setXArr(["01", "02", "03", "04", "05"]);
      }

      setStartIndex(xArr.indexOf(hydrationGuageArr[0].week));
      setXAndBarInfo({
        barInterval: numOfWeek === 6 ? 300 / 19 : 100 / 7,
        barWidth: numOfWeek === 6 ? 600 / 19 : 300 / 7,
      });
    } else if (range === "년") {
      // 3. 년
      // prettier-ignore
      setXArr(["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]);
      setStartIndex(xArr.indexOf(hydrationGuageArr[0].month));
      setXAndBarInfo({
        barInterval: 300 / 37,
        barWidth: 600 / 37,
      });
    }

    // 평균 계산
    let sumOfHydrationGuage: number = 0;
    hydrationGuageArr.forEach((value) => {
      sumOfHydrationGuage += value.hydration_guage;
    });
    setAvg(sumOfHydrationGuage / hydrationGuageArr.length);
  }, [hydrationGuageArr]);

  return (
    <>
      {hydrationGuageArr.length !== 0 ? (
        <>
          {startIndex >= 0 && (
            <>
              <View style={[styles.avgTextView]}>
                <Text style={[styles.avgText, styles.avgTopText]}>
                  {`목표 음수량 달성률 `}
                </Text>
                <Text
                  style={[
                    styles.avgText,
                    styles.avgBottomText,
                  ]}>{` 평균 ${avg.toFixed(1)}%`}</Text>
              </View>
              <View style={[styles.graphView]}>
                {/* Y축 */}
                <View style={[styles.yAxis]}>
                  <View
                    style={[
                      styles.yTextView,
                      { bottom: 180 + (150 - 100) * 0.9 },
                    ]}>
                    <Text>150%</Text>
                  </View>
                  {[100, 90, 60, 30].map((value) => (
                    <View
                      key={value}
                      style={[styles.yTextView, { bottom: value * 1.8 }]}>
                      <Text>{value}%</Text>
                    </View>
                  ))}
                </View>
                {/* 100%, 150% 수평선 */}
                <View style={[styles.horizontalLine, styles.redLine]} />
                <View style={[styles.horizontalLine, styles.blackLine]} />
                {/* X축, Bar */}
                <View style={[styles.flatListView]}>
                  {xArr.map((value, index) => (
                    <XAndBar
                      key={index}
                      left={
                        (index + 1) * xAndBarInfo.barInterval +
                        index * xAndBarInfo.barWidth
                      }
                      width={xAndBarInfo.barWidth}
                      xText={value}
                      guage={
                        index >= startIndex &&
                        index <= hydrationGuageArr.length - 1 + startIndex
                          ? hydrationGuageArr[index - startIndex]
                              .hydration_guage
                          : 0
                      }
                    />
                  ))}
                </View>
              </View>
            </>
          )}
        </>
      ) : (
        <View style={[styles.noResultView]}>
          <Text>조회되는 데이터가 없습니다.</Text>
        </View>
      )}
    </>
  );
};

export default HydrationGraph;

const styles = StyleSheet.create({
  // 평균
  avgTextView: {
    flexDirection: "row",
  },
  avgText: {
    textAlign: "center",
    lineHeight: 30,
  },
  avgTopText: {
    fontSize: 16,
  },
  avgBottomText: {
    fontSize: 18,
  },

  // 그래프
  graphView: {
    position: "relative",
    width: 300,
    height: 290,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    right: -15,
    marginTop: 50,
  },

  // y축
  yAxis: {
    position: "absolute",
    left: -50,
    bottom: -10,
    width: 40,
    alignItems: "flex-end",
  },
  yTextView: {
    position: "absolute",
  },

  // 수평선
  horizontalLine: {
    position: "absolute",
    zIndex: 10,
    height: 0.7,
    width: 300,
  },
  redLine: {
    backgroundColor: "#d20000",
    bottom: 225,
  },
  blackLine: {
    backgroundColor: "#a3a3a3",
    bottom: 180,
  },

  // 그래프
  flatListView: {
    position: "absolute",
    width: 296,
    height: 311,
    bottom: -23,
  },

  // 결과 없음
  noResultView: {
    marginTop: 30,
  },
});
