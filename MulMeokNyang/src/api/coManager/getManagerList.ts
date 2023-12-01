import axios from "axios";

export const getManagerList = async (spaceId: string) => {
  console.log("-----getManagerList API 호출 중-----");
  console.log("spaceId :", spaceId);

  try {
    const res = await axios.get(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/getManagerList",
      {
        params: {
          managementSpaceId: spaceId,
        },
      }
    );

    const mainManagerUserEmail = res.data.mainManagerUserEmail;
    const coManagersUserEmail = res.data.coManagersUserEmail;
    console.log("mainManagerUserEmail :", mainManagerUserEmail);
    console.log("coManagersUserEmail :", coManagersUserEmail);

    return { mainManagerUserEmail, coManagersUserEmail };
  } catch (error: any) {
    console.log("getManagerList API 호출에서 error 발생 :", error.message);
    throw error;
  }
};
