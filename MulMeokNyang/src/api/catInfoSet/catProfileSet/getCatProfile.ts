import axios from "axios";

export const getCatProfile = async (spaceId: string, id: string) => {
  try {
    const res = await axios.get("/getCatProfile", {
      params: {
        managementSpaceId: spaceId,
        catId: id,
      },
    });
    const catProfilePhotoUrl = res.data.catProfilePhotoUrl;
    const catName = res.data.catName;
    const catAge = res.data.catAge;
    const catWeight = res.data.catWeight;
    return { catProfilePhotoUrl, catName, catAge, catWeight };
  } catch (error: any) {
    console.log("getCatProfile API 호출 함수에서 error 발생 :", error.message);
    throw error;
  }
};
