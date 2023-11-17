import axios from "axios";

export const deleteCatInfo = async (spaceId: string, id: string) => {
  try {
    const res = await axios.delete("/deleteCatInfo", {
      data: {
        managementSpaceId: spaceId,
        catId: id,
      },
    });

    const deleteSuccess = res.data.deleteSuccess;
    return deleteSuccess;
  } catch (error: any) {
    console.log("deleteCatInfo API 호출에서 error 발생 :", error.message);
    throw error;
  }
};
