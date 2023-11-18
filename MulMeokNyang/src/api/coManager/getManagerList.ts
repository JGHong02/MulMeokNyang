import axios from "axios";

export const getManagerList = async (spaceId: string) => {
  try {
    const res = await axios.get("/getManagerList", {
      params: {
        managementSpaceId: spaceId,
      },
    });

    const mainManagerUserEmail = res.data.mainManagerUserEmail;
    // JSON화된 배열이 전달되기 때문에 JSON.parse 메소드를 사용해 배열로 바꿔줘야 함
    const coManagersUserEmail = JSON.parse(res.data.coManagersUserEmail);

    return { mainManagerUserEmail, coManagersUserEmail };
  } catch (error: any) {
    console.log("getManagerList API 호출에서 error 발생 :", error.message);
    throw error;
  }
};
