import axios from "axios";

export const getCatHydration = async (spaceId: string, id: string) => {
  try {
    const res = await axios.get("/getCatHydration", {
      params: {
        managementSpaceId: spaceId,
        catId: id,
      },
    });
    const isHydrationAuto = res.data.isHydrationAuto;
    const catGoalHydration = res.data.catGoalHydration;
    return { isHydrationAuto, catGoalHydration };
  } catch (error: any) {
    console.log(
      "getCatHydration API 호출 함수에서 error 발생 :",
      error.message
    );
    throw error;
  }
};
