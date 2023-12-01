import axios from "axios";

export const getManagementSpaceId = async (email: string) => {
  console.log("-----getManagementSpaceId API 호출 중-----");
  console.log("email :", email);

  try {
    const res = await axios.get(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/getManagementSpaceId",
      {
        params: {
          userEmail: email,
        },
      }
    );
    const managementSpaceId = res.data.managementSpaceId;
    console.log("managementSpaceId :", managementSpaceId);

    return managementSpaceId;
  } catch (error: any) {
    console.log(
      "getManagementSpaceId API 호출 함수에서 error 발생 :",
      error.message
    );
    throw error;
  }
};
