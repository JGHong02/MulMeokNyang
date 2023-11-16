import axios from "axios";

export const getCatProfileList = async (spaceId: string) => {
  try {
    const res = await axios.get("/getCatProfileList", {
      params: {
        managementSpaceId: spaceId,
      },
    });

    const catIdArr = JSON.parse(res.data.catIdArr);
    const catProfilePhotoUrlArr = JSON.parse(res.data.catProfilePhotoUrlArr);

    return { catIdArr, catProfilePhotoUrlArr };
  } catch (error: any) {
    console.log(
      "getCatProfileList API 호출 함수에서 error 발생 :",
      error.message
    );
    throw error;
  }
};
