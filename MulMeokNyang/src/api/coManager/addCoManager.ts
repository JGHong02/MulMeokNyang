import axios from "axios";

export const addCoManager = async (spaceId: string, nickname: string) => {
  console.log("-----addCoManager API 호출 중-----");
  console.log("spaceId :", spaceId);
  console.log("nickname :", nickname);

  try {
    const res = await axios.post(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/addCoManager",
      {
        managementSpaceId: spaceId,
        userNickname: nickname,
      }
    );

    const addSuccess = res.data.addSuccess;
    console.log("addSucess :", addSuccess);

    return addSuccess;
  } catch (error: any) {
    console.log("addCoManager API 호출에서 error 발생 :", error.message);
    throw error;
  }
};
