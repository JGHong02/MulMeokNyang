// Context
import { UserContext } from "../../contexts/UserContext";
import { CatContext } from "../../contexts/CatContext";
// FC Type
import type { FC } from "react";
// Hook
import { useState, useContext, useEffect, useCallback } from "react";
// Platform, Dimensions, StyleSheet, Component
import { Platform, Dimensions, StyleSheet } from "react-native";
import {
  SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
// Custom Component
import TopBar from "../../components/TopBar";
import CatProfileList from "../../components/CatProfileList";
import {
  WeekCalendar,
  MonthCalendar,
  YearCalendar,
} from "../../components/calendar";
// Icon
import ETIcon from "react-native-vector-icons/Entypo";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
// styles
import mainViewStyles from "../../styles/mainViewStyles";

const { width, height } = Dimensions.get("window");

type HydrationStatistics = {
  route: any;
};

const HydrationStatistics: FC<HydrationStatistics> = ({ route }) => {
  // params로 전달된 catId를 currentSelectedCatId state의 초깃값으로 설정
  const { catId } = route.params;
  const [currentSelectedCatId, setCurrentSelectedCatId] =
    useState<string>(catId);

  // 통계량 데이터를 불러오기 위한 전역 변수 불러오기
  const { managementSpaceIdGV } = useContext(UserContext);
  const { catIdArrGV, catProfilePhotoUrlArrGV } = useContext(CatContext);

  // 통계 기간 관련 state
  const [range, setRange] = useState<string>("주"); // '주', '달', '년'
  // 범위가 "주"일 때
  const [weekRange, setWeekRange] = useState<string[]>([]);
  // 범위가 "달"일 때
  const [monthRange, setMonthRange] = useState<string>("");
  // 범위가 "년"일 때
  const [yearRange, setYearRange] = useState<string>("");

  // 캘린더 관련 state
  const [onCalendar, setOnCalendar] = useState<boolean>(false);
  const [canPressCheck, setCanPressCheck] = useState<boolean>(false);

  useEffect(() => {
    console.log(`-------------------\n`, weekRange[0], weekRange[1]);
  }, [weekRange]);
  useEffect(() => {
    console.log(`-------------------\n`, monthRange);
  }, [monthRange]);
  useEffect(() => {
    console.log(`-------------------\n`, yearRange);
  }, [yearRange]);

  // 1. 마운트될 때 실행될 함수 => 이번 주 통계 불러오기

  // 2. range 바뀔 때 실행될 함수 => 이번 주/이번 달/이번 년도 통계 불러오기

  // 3. week 캘린더 '체크' 아이콘 눌렀을 때 실행될 함수 => 특정 주 통계 불러오기

  // 4. month, year 캘린더 '체크' 아이콘 눌렀을 때 실행될 함수 => 특정 달/특정 년도 통계 불러오기

  // 5. 캘린더 '닫기' 아이콘 눌렀을 때 실행될 함수 => 선택됐던 범위 초기화
  const closeCalendar = useCallback(() => {
    setOnCalendar(false);
    setCanPressCheck(false);
    if (range === "주") {
      setWeekRange([]);
    } else if (range === "달") {
      setMonthRange("");
    } else {
      setYearRange("");
    }
  }, [range]);

  return (
    <SafeAreaView style={[styles.safeAreaView]}>
      <View pointerEvents={onCalendar ? "none" : "auto"}>
        <TopBar title="음수량 통계" />
        <View style={[styles.catProfileListView]}>
          <CatProfileList
            idArr={catIdArrGV}
            photoUrlArr={catProfilePhotoUrlArrGV}
            currentSelectedCatId={currentSelectedCatId}
            setCurrentSelectedCatId={setCurrentSelectedCatId}
          />
        </View>
        <View style={[mainViewStyles.mainView]}>
          <View style={[styles.rangeAndCalendarView]}>
            <View style={[styles.selectRangeView]}>
              <FlatList
                horizontal
                scrollEnabled={false}
                data={["주", "달", "년"]}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => setRange(item)}
                    style={[
                      styles.range,
                      item === range && styles.selectedRange,
                    ]}>
                    <Text style={[item === range && styles.selectedRangeText]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
              />
            </View>
            <TouchableOpacity onPress={() => setOnCalendar(true)}>
              <ETIcon name="calendar" size={25} color="#343434" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {onCalendar && (
        <View
          style={[
            styles.calendarView,
            Platform.OS === "android" ? styles.shadowAndroid : styles.shadowIOS,
          ]}>
          <View style={[styles.calendar]}>
            {range === "주" ? (
              <WeekCalendar
                setWeekRange={setWeekRange}
                setCanPressCheck={setCanPressCheck}
              />
            ) : range === "달" ? (
              <MonthCalendar
                setMonthRange={setMonthRange}
                setCanPressCheck={setCanPressCheck}
              />
            ) : (
              <YearCalendar
                setYearRange={setYearRange}
                setCanPressCheck={setCanPressCheck}
              />
            )}
          </View>
          <View style={[styles.calendarIconView]}>
            <TouchableOpacity
              disabled={!canPressCheck}
              onPress={() => {}}
              style={[styles.icon]}>
              <MCIcon
                name="check-circle"
                size={30}
                color={canPressCheck ? "#45539d" : "white"}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={closeCalendar} style={[styles.icon]}>
              <MCIcon name="close-circle" size={30} color="#343434" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default HydrationStatistics;

const styles = StyleSheet.create({
  safeAreaView: {
    position: "relative",
    height: height,
  },
  catProfileListView: {
    width: 400,
    padding: 10,
    borderBottomWidth: 1,
  },

  // range & calendar
  rangeAndCalendarView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  selectRangeView: {
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: "#343434",
    marginRight: 15,
  },
  range: {
    justifyContent: "center",
    alignItems: "center",
    width: 65,
    height: 27,
    backgroundColor: "#cecece",
    borderRightWidth: 1,
    borderColor: "#343434",
  },
  selectedRange: {
    backgroundColor: "#343434",
  },
  selectedRangeText: {
    color: "white",
  },

  // 캘린더
  calendarView: {
    position: "absolute",
    width: width,
    height: 445,
    bottom: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  calendar: {
    position: "absolute",
    width: width,
    top: 50,
    zIndex: 1,
  },
  shadowAndroid: {
    elevation: 20,
  },
  shadowIOS: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  calendarIconView: {
    width: 100,
    flexDirection: "row",
    position: "absolute",
    right: 0,
    top: 15,
  },
  icon: {
    width: 40,
    height: 40,
    alignItems: "center",
  },
});
