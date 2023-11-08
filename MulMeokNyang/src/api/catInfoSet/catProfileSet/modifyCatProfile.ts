import axios from "axios";

export const modifyCatProfile = async (spaceId: string, id: number) => {
  try {
    const res = await axios.put("/modifyCatProfile", {
      managementSpaceId: spaceId,
      catId: id,
    });

    // 고양이 프로필 수정 성공
    const modifySuccess = res.data.modifySuccess;
    return modifySuccess;
  } catch (error: any) {
    console.log(
      "modifyCatProfile API 호출 함수에서 error 발생 :",
      error.message
    );
    throw error;
  }
};
