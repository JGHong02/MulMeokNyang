import axios from "axios";

export const modifyCatHydration = async (
  spaceId: string,
  id: string,
  isAuto: boolean,
  goalHydration: string
) => {
  console.log("-----modifyCatHydration API 호출 중-----");
  console.log("spaceId :", spaceId);
  console.log("id :", id);
  console.log("isAuto :", isAuto);
  console.log("goalHydration :", goalHydration);

  try {
    const res = await axios.put(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/modifyCatHydration",
      {
        managementSpaceId: spaceId,
        catId: id,
        isHydrationAuto: isAuto,
        catGoalHydration: goalHydration,
      }
    );

    const modifySuccess = res.data.modifySuccess;
    console.log("modifySuccess :", modifySuccess);

    return modifySuccess;
  } catch (error: any) {
    console.log(
      "modifyCatHydration API 호출 함수에서 error 발생 :",
      error.message
    );
    throw error;
  }
};
