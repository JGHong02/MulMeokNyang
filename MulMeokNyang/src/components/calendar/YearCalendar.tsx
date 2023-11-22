// FC, Dispatch, SetStateAction Type
import type { FC, Dispatch, SetStateAction } from "react";
// Hook
import { useState, useCallback, useEffect } from "react";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { View, TouchableOpacity, Text, FlatList } from "react-native";
// Custom Component
import CalendarHeader from "./CalendarHeader";

type YearCalendarProps = {
  setYearRange: Dispatch<SetStateAction<string>>;
  setCanPressCheck: Dispatch<SetStateAction<boolean>>;
};

const YearCalendar: FC<YearCalendarProps> = ({
  setYearRange,
  setCanPressCheck,
}) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  // CalendarHeader의 headerText에 사용될 state
  const [years, setYears] = useState<number[]>([currentYear - 11, currentYear]);
  const [selectedYear, setSelectedYear] = useState<string>("");

  // 헤더 왼쪽 아이콘 함수
  const decreaseYear = useCallback(() => {
    setYears((prev) => [prev[0] - 12, prev[1] - 12]);
  }, []);
  // 헤더 오른쪽 아이콘 함수
  const IncreaseYear = useCallback(() => {
    setYears((prev) => [prev[0] + 12, prev[1] + 12]);
  }, []);

  // selectedYear가 바뀔 때마다 부모 컴포넌트의 yearRange도 바꾸고,
  // 통계 데이터를 불러올 API를 호출할 '체크' 버튼을 누를 수 있게 바꾸기
  useEffect(() => {
    setYearRange(selectedYear);
    if (selectedYear) {
      setCanPressCheck(true);
    }
  }, [selectedYear]);

  return (
    <View>
      <View>
        <CalendarHeader
          headerText={`${years[0]} - ${years[1]}`}
          isCurrentYear={years[1] === currentYear}
          decreaseYear={decreaseYear}
          IncreaseYear={IncreaseYear}
        />
      </View>
      <FlatList
        data={Array.from({ length: 12 }, (_, index) =>
          (index + years[0]).toString()
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedYear(item);
            }}
            style={[
              styles.item,
              selectedYear === item && { backgroundColor: "#45539d" },
            ]}>
            <Text style={[selectedYear === item && { color: "white" }]}>
              {item}년
            </Text>
          </TouchableOpacity>
        )}
        numColumns={4}
        keyExtractor={(item) => item}
        ItemSeparatorComponent={() => (
          <View style={[styles.itemSeparator]}></View>
        )}
      />
    </View>
  );
};

export default YearCalendar;

const styles = StyleSheet.create({
  // FlatList
  item: {
    flex: 2.5,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  itemSeparator: {
    height: 20,
  },
});
