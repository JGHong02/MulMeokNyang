// Calendar
import { Calendar, LocaleConfig } from "react-native-calendars";
// FC, Dispatch, SetStateAction Type
import type { FC, Dispatch, SetStateAction } from "react";
// Hook
import { useState, useEffect } from "react";

// 달력 한국어 설정
LocaleConfig.locales["fr"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  dayNames: ["일", "월", "화", "수", "목", "금", "토"],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  today: "Aujourd'hui",
};

LocaleConfig.defaultLocale = "fr";

// Calendar 컴포넌트 props 형식에 맞는 string으로 변환
const changeTodateString = (date: Date) => {
  const year = date.getFullYear();
  // 월은 0부터 시작하므로 1을 더하고 2자리로 맞추기
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  // 2자리로 맞추기
  const day = date.getDate().toString().padStart(2, "0");
  // 형식에 맞게 저장
  const dateString = `${year}-${month}-${day}`;

  return dateString;
};

type WeekCalendarProps = {
  setWeekRange: Dispatch<SetStateAction<string[]>>;
  setCanPressCheck: Dispatch<SetStateAction<boolean>>;
};

const WeekCalendar: FC<WeekCalendarProps> = ({
  setWeekRange,
  setCanPressCheck,
}) => {
  // 오늘 날짜
  const todayString = changeTodateString(new Date());
  // 누른 날짜
  const [selectedDay, setSelectedDay] = useState<string>("");
  // 선택된 주
  const [selectedWeek, setSelectedWeek] = useState({});

  // 날짜를 누를 때마다 선택되는 기간이 그 주로 바뀜
  useEffect(() => {
    const selectedDate = new Date(selectedDay);
    // 0(일) ~ 6(토)
    const dayOfWeek = selectedDate.getDay();
    // 월요일(1)까지 거리, 일요일의 경우 음수가 되기 때문에 6으로 처리
    const distanceFromMon = dayOfWeek !== 0 ? dayOfWeek - 1 : 6;
    // 월요일부터 시작
    const date = new Date(
      selectedDate.getTime() - distanceFromMon * 24 * 60 * 60 * 1000
    );

    const newSelectedPeriod: { [key: string]: any } = {};

    for (let i = 0; i < 7; i++) {
      const dateString = changeTodateString(date);
      // 오늘 날짜까지만 조회 가능
      const isMaxDate = dateString === todayString;

      const isSelectedDay = date.getDate() === selectedDate.getDate();
      const color = isSelectedDay ? "#45539d" : "#dee3ff";
      const textColor = isSelectedDay ? "white" : "black";
      const startingDay = i === 0;
      const endingDay = isMaxDate || i === 6;

      newSelectedPeriod[dateString] = {
        selected: true,
        color: color,
        textColor: textColor,
        startingDay: startingDay,
        endingDay: endingDay,
      };

      if (isMaxDate) break;

      date.setDate(date.getDate() + 1);
    }

    setSelectedWeek(newSelectedPeriod);
    setWeekRange([
      Object.keys(newSelectedPeriod)[0],
      Object.keys(newSelectedPeriod)[Object.keys(newSelectedPeriod).length - 1],
    ]);
  }, [selectedDay]);

  return (
    <Calendar
      // 기본 선택된 날짜
      current={todayString}
      // 최대 선택 가능 날짜
      maxDate={todayString}
      // 기간 형식
      markingType="period"
      // 선택된 날짜
      markedDates={selectedWeek}
      // 커스텀
      theme={{
        // 화살표 색깔
        arrowColor: "#343434",
      }}
      onDayPress={(day) => {
        setSelectedDay(day.dateString);
        setCanPressCheck(true);
      }}
    />
  );
};

export default WeekCalendar;
