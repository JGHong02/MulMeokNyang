import axios from "axios";

export const modifyCatFeedStuff = async (
  spaceId: string,
  id: string,
  isEating: boolean,
  dailyConsumption: string,
  moistureContent: string
) => {
  try {
    const res = await axios.put("/modifyCatFeedStuff", {
      managementSpaceId: spaceId,
      catId: id,
      isEatingFeedStuff: isEating,
      catFeedStuffDailyConsumption: dailyConsumption,
      catFeedStuffMoistureContent: moistureContent,
    });

    const modifySuccess = res.data.modifySuccess;
    return modifySuccess;
  } catch (error: any) {
    console.log(
      "modifyCatFeedStuff API 호출 함수에서 error 발생 :",
      error.message
    );
    throw error;
  }
};
