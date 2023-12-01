import axios from "axios";

export const modifyCatFeedStuff = async (
  spaceId: string,
  id: string,
  isEating: boolean,
  dailyConsumption: string,
  moistureContent: string
) => {
  console.log("-----modifyCatFeedStuff API 호출 중-----");
  console.log("spaceId :", spaceId);
  console.log("id :", id);
  console.log("isEating :", isEating);
  console.log("dailyConsumption :", dailyConsumption);
  console.log("moistureContent :", moistureContent);

  try {
    const res = await axios.put(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/modifyCatFeedStuff",
      {
        managementSpaceId: spaceId,
        catId: id,
        isEatingFeedStuff: isEating,
        catFeedStuffDailyConsumption: dailyConsumption,
        catFeedStuffMoistureContent: moistureContent,
      }
    );

    const modifySuccess = res.data.modifySuccess;
    console.log("modifySuccess :", modifySuccess);

    return modifySuccess;
  } catch (error: any) {
    console.log(
      "modifyCatFeedStuff API 호출 함수에서 error 발생 :",
      error.message
    );
    throw error;
  }
};
