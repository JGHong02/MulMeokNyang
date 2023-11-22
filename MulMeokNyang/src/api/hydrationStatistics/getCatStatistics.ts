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
    const randomIndex = Math.floor(Math.random() * 2);
    const randomArr = [
      [
        { day: "07", hydration_guage: 55 },
        { day: "08", hydration_guage: 76 },
        { day: "09", hydration_guage: 130 },
        { day: "10", hydration_guage: 27 },
        { day: "11", hydration_guage: 198 },
        { day: "12", hydration_guage: 12 },
        { day: "13", hydration_guage: 100 },
      ],
      [
        { day: "28", hydration_guage: 50 },
        { day: "29", hydration_guage: 70 },
      ],
    ];

    return randomArr[randomIndex];
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
    const randomIndex = Math.floor(Math.random() * 6);
    const randomArr = [
      [
        { week: "01", hydration_guage: 64 },
        { week: "02", hydration_guage: 3 },
      ],
      [
        { week: "01", hydration_guage: 99 },
        { week: "02", hydration_guage: 44 },
        { week: "03", hydration_guage: 150 },
        { week: "04", hydration_guage: 200 },
        { week: "05", hydration_guage: 111 },
      ],
      [
        { week: "01", hydration_guage: 55 },
        { week: "02", hydration_guage: 76 },
        { week: "03", hydration_guage: 130 },
        { week: "04", hydration_guage: 27 },
        { week: "05", hydration_guage: 198 },
        { week: "06", hydration_guage: 12 },
      ],
      [
        { week: "02", hydration_guage: 13 },
        { week: "03", hydration_guage: 165 },
        { week: "04", hydration_guage: 65 },
      ],
      [{ week: "06", hydration_guage: 50 }],
      [
        { week: "02", hydration_guage: 67 },
        { week: "03", hydration_guage: 30 },
        { week: "04", hydration_guage: 72 },
        { week: "05", hydration_guage: 89 },
      ],
    ];

    return randomArr[randomIndex];
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
    const randomIndex = Math.floor(Math.random() * 6);
    const randomArr = [
      [
        { month: "01", hydration_guage: 10 },
        { month: "02", hydration_guage: 20 },
        { month: "03", hydration_guage: 30 },
        { month: "04", hydration_guage: 40 },
        { month: "05", hydration_guage: 50 },
        { month: "06", hydration_guage: 60 },
        { month: "07", hydration_guage: 70 },
        { month: "08", hydration_guage: 80 },
        { month: "09", hydration_guage: 90 },
        { month: "10", hydration_guage: 100 },
        { month: "11", hydration_guage: 120 },
        { month: "12", hydration_guage: 140 },
      ],
      [
        { month: "02", hydration_guage: 44 },
        { month: "03", hydration_guage: 150 },
        { month: "04", hydration_guage: 200 },
        { month: "05", hydration_guage: 111 },
      ],
      [
        { month: "05", hydration_guage: 198 },
        { month: "06", hydration_guage: 12 },
        { month: "07", hydration_guage: 7 },
        { month: "08", hydration_guage: 62 },
        { month: "09", hydration_guage: 166 },
        { month: "10", hydration_guage: 24 },
      ],
      [{ month: "11", hydration_guage: 50 }],
    ];

    return randomArr[randomIndex];
  }
};
