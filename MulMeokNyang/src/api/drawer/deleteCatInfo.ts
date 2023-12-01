import axios from "axios";

export const deleteCatInfo = async (spaceId: string, id: string) => {
  console.log("-----deleteCatInfo API 호출 중-----");
  console.log("spaceId :", spaceId);
  console.log("id :", id);

  try {
    const res = await axios.delete(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/deleteCatInfo",
      {
        data: {
          managementSpaceId: spaceId,
          catId: id,
        },
      }
    );

    const deleteSuccess = res.data.deleteSuccess;
    console.log("deleteSuccess :", deleteSuccess);

    return deleteSuccess;
  } catch (error: any) {
    console.log("deleteCatInfo API 호출에서 error 발생 :", error.message);
    throw error;
  }
};
