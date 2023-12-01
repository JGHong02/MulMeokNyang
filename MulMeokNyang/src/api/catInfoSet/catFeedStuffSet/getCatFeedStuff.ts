import axios from "axios";

export const getCatFeedStuff = async (spaceId: string, id: string) => {
  console.log("-----getCatFeedStuff API 호출 중-----");
  console.log("spaceId :", spaceId);
  console.log("id :", id);

  try {
    const res = await axios.get(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/getCatFeedStuff",
      {
        params: {
          managementSpaceId: spaceId,
          catId: id,
        },
      }
    );

    const isEatingFeedStuff = res.data.isEatingFeedStuff;
    const catFeedStuffDailyConsumption =
      res.data.catFeedStuffDailyConsumption.toString();
    const catFeedStuffMoistureContent =
      res.data.catFeedStuffMoistureContent.toString();
    console.log("isEatingFeedStuff :", isEatingFeedStuff);
    console.log("catFeedStuffDailyConsumption :", catFeedStuffDailyConsumption);
    console.log("catFeedStuffMoistureContent :", catFeedStuffMoistureContent);

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
