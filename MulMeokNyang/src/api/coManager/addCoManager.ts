import axios from "axios";

export const addCoManager = async (spaceId: string, nickname: string) => {
  try {
    const res = await axios.post("/addCoManager", {
      managementSpaceId: spaceId,
      userNickname: nickname,
    });

    const addSuccess = res.data.addSuccess;
    return addSuccess;
  } catch (error: any) {
    console.log("addCoManager API 호출에서 error 발생 :", error.message);
    throw error;
  }
};
