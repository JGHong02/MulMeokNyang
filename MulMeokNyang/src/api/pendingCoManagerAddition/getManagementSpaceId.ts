import axios from "axios";

export const getManagementSpaceId = async (email: string) => {
  try {
    const res = await axios.get("/getManagementSpaceId", {
      params: {
        userEmail: email,
      },
    });
    const managementSpaceId = res.data.managementSpaceId;
    return managementSpaceId;
  } catch (error: any) {
    console.log("login API 호출 함수에서 error 발생 :", error.message);
    throw error;
  }
};
