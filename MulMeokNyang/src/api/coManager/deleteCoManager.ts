import axios from "axios";

export const deleteCoManager = async (spaceId: string, email: string) => {
  console.log("-----deleteCoManager API 호출 중-----");
  console.log("spaceId :", spaceId);
  console.log("email :", email);

  try {
    const res = await axios.delete(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/deleteCoManager",
      {
        data: {
          managementSpaceId: spaceId,
          coManagerUserEmail: email,
        },
      }
    );

    const deleteSuccess = res.data.deleteSuccess;
    console.log("deleteSuccses :", deleteSuccess);

    return deleteSuccess;
  } catch (error: any) {
    console.log("deleteCoManager API 호출에서 error 발생 :", error.message);
    throw error;
  }
};
