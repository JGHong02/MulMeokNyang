import axios from "axios";

export const modifyCatHydration = async (
  spceId: string,
  id: string,
  isAuto: boolean,
  goalHydration: string
) => {
  try {
    const res = await axios.put("/modifyCatHydration", {
      managementSpaceId: spceId,
      catId: id,
      isHydrationAuto: isAuto,
      catGoalHydration: goalHydration,
    });

    const modifySuccess = res.data.modifySuccess;
    return modifySuccess;
  } catch (error: any) {
    console.log(
      "modifyCatHydration API 호출 함수에서 error 발생 :",
      error.message
    );
    throw error;
  }
};
