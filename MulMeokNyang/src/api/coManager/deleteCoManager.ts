import axios from "axios";

export const deleteCoManager = async (spaceId: string, email: string) => {
  try {
    const res = await axios.delete("/deleteCoManager", {
      data: {
        managementSpaceId: spaceId,
        coManagerUserEmail: email,
      },
    });

    const deleteSuccess = res.data.deleteSuccess;
    return deleteSuccess;
  } catch (error: any) {
    console.log("deleteCoManager API 호출에서 error 발생 :", error.message);
    throw error;
  }
};
