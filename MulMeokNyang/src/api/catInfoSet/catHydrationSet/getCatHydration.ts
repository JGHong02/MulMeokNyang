import axios from "axios";

export const getCatHydration = async (spaceId: string, id: string) => {
  console.log("-----getCatHydration API 호출 중-----");
  console.log("spaceId :", spaceId);
  console.log("id :", id);

  try {
    const res = await axios.get(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/getCatHydration",
      {
        params: {
          managementSpaceId: spaceId,
          catId: id,
        },
      }
    );

    const isHydrationAuto = res.data.isHydrationAuto;
    const recommendedHydration = res.data.recommendedHydration;
    const catGoalHydration = res.data.catGoalHydration.toString();
    console.log("isHydrationAuto :", isHydrationAuto);
    console.log("recommendedHydration :", recommendedHydration);
    console.log("catGoalHydration :", catGoalHydration);

    return { isHydrationAuto, recommendedHydration, catGoalHydration };
  } catch (error: any) {
    console.log(
      "getCatHydration API 호출 함수에서 error 발생 :",
      error.message
    );
    throw error;
  }
};
