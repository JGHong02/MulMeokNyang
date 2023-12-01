import axios from "axios";

export const getCatProfileList = async (spaceId: string) => {
  console.log("-----getCatProfileList API 호출 중-----");
  console.log("spaceId :", spaceId);

  try {
    const res = await axios.get(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/getCatProfileList",
      {
        params: {
          managementSpaceId: spaceId,
        },
      }
    );

    console.log(res.data);
    const catIdArr = res.data.catIdArr;
    const catProfilePhotoArr = res.data.catProfilePhotoArr;
    console.log("catIdArr :", catIdArr);
    console.log("catProfilePhotoUrlArr :", catProfilePhotoArr);

    return { catIdArr, catProfilePhotoArr };
  } catch (error: any) {
    console.log(
      "getCatProfileList API 호출 함수에서 error 발생 :",
      error.message
    );
    throw error;
  }
};
