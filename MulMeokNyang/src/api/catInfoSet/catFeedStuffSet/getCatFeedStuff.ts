import axios from "axios";

export const getCatFeedStuff = async (spaceId: string, id: string) => {
  try {
    const res = await axios.get("/getCatFeedStuff", {
      params: {
        managementSpaceId: spaceId,
        catId: id,
      },
    });
    const isEatingFeedStuff = res.data.isEatingFeedStuff;
    const catFeedStuffDailyConsumption = res.data.catFeedStuffDailyConsumption;
    const catFeedStuffMoistureContent = res.data.catFeedStuffMoistureContent;
    return {
      isEatingFeedStuff,
      catFeedStuffDailyConsumption,
      catFeedStuffMoistureContent,
    };
  } catch (error: any) {
    console.log(
      "getCatFeedStuff API 호출 함수에서 error 발생 :",
      error.message
    );
    throw error;
  }
};
