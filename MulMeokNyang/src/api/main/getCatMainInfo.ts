import axios from "axios";

export const getCatMainInfo = async (id: string, spaceId: string) => {
  console.log("-----getCatMainInfo API 호출 중-----");
  console.log("id :", id);
  console.log("spaceId :", spaceId);

  try {
    const res = await axios.get(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/getCatMainInfo",
      {
        params: {
          catId: id,
          managementSpaceId: spaceId,
        },
      }
    );

    const catName = res.data.catName;
    const catAge = res.data.catAge;
    const catWeight = res.data.catWeight;
    const hydrationGuage = res.data.hydrationGuage;
    console.log("catName :", catName);
    console.log("catAge :", catAge);
    console.log("catWeight :", catWeight);
    console.log("hydrationGuage :", hydrationGuage);

    return { catName, catAge, catWeight, hydrationGuage };
  } catch (error: any) {
    console.log("getCatMainInfo API 호출 함수에서 error 발생 :", error.message);
    throw error;
  }
};
