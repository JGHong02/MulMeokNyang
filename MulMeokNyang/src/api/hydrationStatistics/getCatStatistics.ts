import axios from "axios";

export const getCatWeekStatistics = async (
  catId: string,
  range: string,
  startDate: string,
  endDate: string
) => {
  try {
    // #####################확인용#####################
    console.log(
      "주 통계 API 호출됨\n",
      `catId: ${catId}, range: ${range}, startDate: ${startDate}, endDate: ${endDate}\n`,
      "---------------------------------------------------------------------------------------"
    );

    const res = await axios.get("/getCatStatistics", {
      params: {
        currentSelectedCatId: catId,
        range,
        startDate,
        endDate,
      },
    });

    // res.data의 newHydrationGuageArr: 빈 배열 [] 또는,
    // [{day: ‘DD’, hydration_guage: n}, {day: ‘DD’, hydration_guage: n}, …]
    const weekHydrationGuageArr = JSON.parse(res.data.newHydrationGuageArr);
    return weekHydrationGuageArr;
  } catch (error: any) {
    // console.log(
    //   "getCatWeekStatistics API 호출에서 error 발생 :",
    //   error.message
    // );
    // throw error;

    // ##############가짜 데이터################
    return [
      { day: "20", hydration_guage: 180 },
      { day: "21", hydration_guage: 19 },
      { day: "22", hydration_guage: 112 },
      { day: "23", hydration_guage: 46 },
      { day: "24", hydration_guage: 180 },
    ];
    // return [];
  }
};

export const getCatMonthStatistics = async (
  catId: string,
  range: string,
  month: string
) => {
  try {
    // #####################확인용#####################
    console.log(
      "달 통계 API 호출됨\n",
      `catId: ${catId}, range: ${range}, month: ${month}\n`,
      "---------------------------------------------------------------------------------------"
    );

    const res = await axios.get("/getCatStatistics", {
      params: {
        currentSelectedCatId: catId,
        range,
        month,
      },
    });

    // res.data의 newHydrationGuageArr: 빈 배열 [] 또는,
    // [{week: ‘WW’, hydration_guage: n}, {week: ‘WW’, hydration_guage: n}, …]
    const monthHydrationGuageArr = JSON.parse(res.data.newHydrationGuageArr);
    return monthHydrationGuageArr;
  } catch (error: any) {
    // console.log(
    //   "getCatMonthStatistics API 호출에서 error 발생 :",
    //   error.message
    // );
    // throw error;

    // ##############가짜 데이터################
    // [
    //   { week: "02", hydration_guage: 44 },
    //   { week: "03", hydration_guage: 150 },
    //   { week: "04", hydration_guage: 200 },
    // ],
    // [
    //   { week: "01", hydration_guage: 44 },
    //   { week: "02", hydration_guage: 88 },
    //   { week: "03", hydration_guage: 166 },
    // ],
    // [
    //   { week: "01", hydration_guage: 44 },
    //   { week: "02", hydration_guage: 148 },
    //   { week: "03", hydration_guage: 90 },
    //   { week: "04", hydration_guage: 10 },
    //   { week: "05", hydration_guage: 22 },
    // ],
    // [
    //   { week: "02", hydration_guage: 44 },
    //   { week: "03", hydration_guage: 66 },
    //   { week: "04", hydration_guage: 90 },
    //   { week: "05", hydration_guage: 10 },
    //   { week: "06", hydration_guage: 22 },
    // ],
    const randomIdx = Math.floor(Math.random() * 1);
    const randomData = [
      [
        { week: "02", hydration_guage: 48 },
        { week: "03", hydration_guage: 9 },
        { week: "04", hydration_guage: 100 },
        { week: "05", hydration_guage: 137 },
      ],
    ];
    return randomData[randomIdx];
  }
};

export const getCatYearStatistics = async (
  catId: string,
  range: string,
  year: string
) => {
  try {
    // #####################확인용#####################
    console.log(
      "년 통계 API 호출됨\n",
      `catId: ${catId}, range: ${range}, year: ${year}\n`,
      "---------------------------------------------------------------------------------------"
    );

    const res = await axios.get("/getCatStatistics", {
      params: {
        currentSelectedCatId: catId,
        range,
        year,
      },
    });

    // res.data의 newHydrationGuageArr: 빈 배열 [] 또는,
    // [{month: ‘MM’, hydration_guage: n}, {month: ‘MM’, hydration_guage: n}, …]
    const yearHydrationGuageArr = JSON.parse(res.data.newHydrationGuageArr);
    return yearHydrationGuageArr;
  } catch (error: any) {
    // console.log(
    //   "getCatYearStatistics API 호출에서 error 발생 :",
    //   error.message
    // );
    // throw error;

    // ##############가짜 데이터################
    const randomIdx = Math.floor(Math.random() * 2);
    const randomData = [
      [
        { month: "03", hydration_guage: 30 },
        { month: "04", hydration_guage: 40 },
        { month: "05", hydration_guage: 50 },
        { month: "06", hydration_guage: 60 },
        { month: "07", hydration_guage: 70 },
        { month: "08", hydration_guage: 100 },
        { month: "09", hydration_guage: 90 },
        { month: "10", hydration_guage: 180 },
        { month: "11", hydration_guage: 180 },
        { month: "12", hydration_guage: 180 },
      ],
      [
        { month: "04", hydration_guage: 40 },
        { month: "05", hydration_guage: 50 },
        { month: "06", hydration_guage: 60 },
        { month: "07", hydration_guage: 70 },
      ],
    ];
    return randomData[randomIdx];
  }
};
