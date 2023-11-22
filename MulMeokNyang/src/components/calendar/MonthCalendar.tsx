// FC, Dispatch, SetStateAction Type
import type { FC, Dispatch, SetStateAction } from "react";
// Hook
import { useState, useCallback, useEffect } from "react";
// StyleSheet, Component
import { StyleSheet } from "react-native";
import { View, TouchableOpacity, Text, FlatList } from "react-native";
// Custom Component
import CalendarHeader from "./CalendarHeader";

type MonthCalendarProps = {
  setMonthRange: Dispatch<SetStateAction<string>>;
  setCanPressCheck: Dispatch<SetStateAction<boolean>>;
};

const MonthCalendar: FC<MonthCalendarProps> = ({
  setMonthRange,
  setCanPressCheck,
}) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = (currentDate.getMonth() + 1).toString();
  const [year, setYear] = useState<string>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // 헤더 왼쪽 아이콘 함수
  const decreaseYear = useCallback(() => {
    setYear((prev) => (parseInt(prev) - 1).toString());
  }, []);
  // 헤더 오른쪽 아이콘 함수
  const IncreaseYear = useCallback(() => {
    setYear((prev) => (parseInt(prev) + 1).toString());
  }, []);

  // year, selectedMonth가 바뀔 때마다 부모 컴포넌트의 monthRange도 바꾸고,
  // 통계 데이터를 불러올 API를 호출할 '체크' 버튼을 누를 수 있게 바꾸기
  useEffect(() => {
    // 달을 아직 선택 안했으면 return
    if (!selectedMonth) {
      setCanPressCheck(false);
      return;
    }
    // 이전년도에서 눌렀던 달이 올해에 선택 불가능한 달이라면, 초기화하고 return
    if (
      year === currentYear &&
      parseInt(selectedMonth) > parseInt(currentMonth)
    ) {
      setSelectedMonth("");
      setCanPressCheck(false);
      return;
    }
    // 2자리로 맞추기
    const month = selectedMonth.padStart(2, "0");
    setMonthRange(`${year}-${month}`);
    setCanPressCheck(true);
  }, [year, selectedMonth]);

  return (
    <View>
      <CalendarHeader
        headerText={year}
        isCurrentYear={year === currentYear}
        decreaseYear={decreaseYear}
        IncreaseYear={IncreaseYear}
      />
      <FlatList
        data={Array.from({ length: 12 }, (_, index) => (index + 1).toString())}
        renderItem={({ item }) => (
          <TouchableOpacity
            disabled={
              year === currentYear && parseInt(item) > parseInt(currentMonth)
            }
            onPress={() => {
              setSelectedMonth(item);
            }}
            style={[
              styles.item,
              selectedMonth === item && { backgroundColor: "#45539d" },
            ]}>
            <Text
              style={[
                selectedMonth === item && { color: "white" },
                year === currentYear &&
                  parseInt(item) > parseInt(currentMonth) && {
                    color: "#cecece",
                  },
              ]}>
              {item}월
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

export default MonthCalendar;

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
