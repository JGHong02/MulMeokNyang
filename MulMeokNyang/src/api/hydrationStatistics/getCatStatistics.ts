import axios from "axios";

export const getCatWeekStatistics = async (
  spaceId: string,
  catId: string,
  range: string,
  startDate: string,
  endDate: string
) => {
  console.log("-----getCatWeekStatistics API 호출 중-----");
  console.log("spaceId :", spaceId);
  console.log("catId :", catId);
  console.log("range :", range);
  console.log("startDate :", startDate);
  console.log("endDate :", endDate);

  try {
    const res = await axios.get(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/getCatStatistics",
      {
        params: {
          managementSpaceId: spaceId,
          currentSelectedCatId: catId,
          range,
          startDate,
          endDate,
        },
      }
    );

    // res.data의 newHydrationGuageArr: 빈 배열 [] 또는,
    // [{day: ‘DD’, hydration_guage: n}, {day: ‘DD’, hydration_guage: n}, …]
    const weekHydrationGuageArr = res.data.newHydrationGuageArr;
    console.log("weekHydrationGuageArr :", weekHydrationGuageArr);

    return weekHydrationGuageArr;
  } catch (error: any) {
    console.log(
      "getCatWeekStatistics API 호출에서 error 발생 :",
      error.message
    );
    throw error;
  }
};

export const getCatMonthStatistics = async (
  spaceId: string,
  catId: string,
  range: string,
  month: string
) => {
  console.log("-----getCatMonthStatistics API 호출 중-----");
  console.log("spaceId :", spaceId);
  console.log("catId :", catId);
  console.log("range :", range);
  console.log("month :", month);

  try {
    const res = await axios.get(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/getCatStatistics",
      {
        params: {
          managementSpaceId: spaceId,
          currentSelectedCatId: catId,
          range,
          month,
        },
      }
    );

    // res.data의 newHydrationGuageArr: 빈 배열 [] 또는,
    // [{week: ‘WW’, hydration_guage: n}, {week: ‘WW’, hydration_guage: n}, …]
    const monthHydrationGuageArr = res.data.newHydrationGuageArr;
    console.log("monthHydrationGuageArr :", monthHydrationGuageArr);

    return monthHydrationGuageArr;
  } catch (error: any) {
    console.log(
      "getCatMonthStatistics API 호출에서 error 발생 :",
      error.message
    );
    throw error;
  }
};

export const getCatYearStatistics = async (
  spaceId: string,
  catId: string,
  range: string,
  year: string
) => {
  console.log("-----getCatYearStatistics API 호출 중-----");
  console.log("spaceId :", spaceId);
  console.log("catId :", catId);
  console.log("range :", range);
  console.log("year :", year);

  try {
    const res = await axios.get(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/getCatStatistics",
      {
        params: {
          managementSpaceId: spaceId,
          currentSelectedCatId: catId,
          range,
          year,
        },
      }
    );

    console.log("res.data :", res.data);
    // res.data의 newHydrationGuageArr: 빈 배열 [] 또는,
    // [{month: ‘MM’, hydration_guage: n}, {month: ‘MM’, hydration_guage: n}, …]
    const yearHydrationGuageArr = res.data.newHydrationGuageArr;
    console.log("yearHydrationGuageArr :", yearHydrationGuageArr);

    return yearHydrationGuageArr;
  } catch (error: any) {
    console.log(
      "getCatYearStatistics API 호출에서 error 발생 :",
      error.message
    );
    throw error;
  }
};
