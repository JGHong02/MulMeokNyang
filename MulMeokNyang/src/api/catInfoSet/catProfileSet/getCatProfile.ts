import axios from "axios";

export const getCatProfile = async (spaceId: string, id: string) => {
  console.log("-----getCatProfile API 호출 중-----");
  console.log("spaceId :", spaceId);
  console.log("id :", id);

  try {
    const res = await axios.get(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/getCatProfile",
      {
        params: {
          managementSpaceId: spaceId,
          catId: id,
        },
      }
    );
    const catProfilePhoto = res.data.catProfilePhoto;
    const catName = res.data.catName;
    const catAge = res.data.catAge.toString();
    const catWeight = res.data.catWeight.toString();
    console.log("catProfilePhoto :", catProfilePhoto);
    console.log("catName :", catName);
    console.log("catAge :", catAge);
    console.log("catWeight :", catWeight);

    return { catProfilePhoto, catName, catAge, catWeight };
  } catch (error: any) {
    console.log("getCatProfile API 호출 함수에서 error 발생 :", error.message);
    throw error;
  }
};
